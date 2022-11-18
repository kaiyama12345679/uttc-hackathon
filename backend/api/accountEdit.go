package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"main/struct"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func AccountEditHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	//必要なメソッドを許可する
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodPut:
		var editName mystruct.EditName

		if err := json.NewDecoder(r.Body).Decode(&editName); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		cnt := 0
		queStr := fmt.Sprintf("SELECT * FROM users WHERE name = '%v'", editName.NewName)
		rows, err := db.Query(queStr)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		for rows.Next() {
			cnt += 1
		}
		if cnt >= 1 {
			w.WriteHeader(http.StatusConflict)
			return
		}

		tx, err := db.Begin()
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		put, err := tx.Prepare("UPDATE users SET name = ? WHERE id = ?")
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		res, err := put.Exec(editName.NewName, editName.Id)
		if err != nil {
			tx.Rollback()
			fmt.Print(err)
			fmt.Println(res.LastInsertId())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err := tx.Commit(); err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)

	case http.MethodDelete:
		var userId string
		if err := json.NewDecoder(r.Body).Decode(&userId); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		tx1, err1 := db.Begin()
		tx2, err2 := db.Begin()
		if err1 != nil || err2 != nil {
			tx1.Rollback()
			tx2.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		dl1, err1 := tx1.Prepare("DELETE FROM users WHERE id = ?")
		dl2, err2 := tx2.Prepare("DELETE FROM messages WHERE from_id = ? or to_id = ?")
		if err1 != nil || err2 != nil {
			tx1.Rollback()
			tx2.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		res1, err1 := dl1.Exec(userId)
		res2, err2 := dl2.Exec(userId, userId)
		if err1 != nil || err2 != nil {
			tx1.Rollback()
			tx2.Rollback()
			fmt.Println(res1.RowsAffected())
			fmt.Println(res2.RowsAffected())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		err1 = tx1.Commit()
		err2 = tx2.Commit()
		if err1 != nil || err2 != nil {
			tx1.Rollback()
			tx2.Rollback()
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.WriteHeader(http.StatusOK)

	default:
		w.WriteHeader(http.StatusBadRequest)
		return
	}
}
