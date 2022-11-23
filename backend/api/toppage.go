package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"main/struct"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func TopPageHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	//必要なメソッドを許可する
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodGet:
		rows, err := db.Query("SELECT users.id, users.name, IFNULL(SUM(messages.point), 0) FROM users LEFT JOIN messages ON users.id = messages.to_id GROUP BY users.id")
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		users := make([]mystruct.UserResForHTTPGet, 0)

		for rows.Next() {
			var u mystruct.UserResForHTTPGet
			if err := rows.Scan(&u.Id, &u.Name, &u.Points); err != nil {
				log.Printf("fail: rows.Scan, %v\n", err)
				if err := rows.Close(); err != nil {
					log.Printf("fail: rows.Close(), %v\n", err)
				}
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			users = append(users, u)
		}
		bytes, err := json.Marshal(users)
		if err != nil {
			log.Printf("fail: json, Marshal, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)

	case http.MethodPost:
		tx, err := db.Begin()

		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
		}

		var u string

		if err := json.NewDecoder(r.Body).Decode(&u); err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		//rows, err := tx.Query("SELECT * from user WHERE id = %s", u)
		bytes, err := json.Marshal(u)
		if err != nil {
			fmt.Println(err)
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(bytes)

	
	case http.MethodPut:
		var e string
		if err := json.NewDecoder(r.Body).Decode(&e); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		queStr = fmt.Sprintf("SELECT * FROM users WHERE email_address = %v", e)
		rows, err := db.Query(queStr)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		
		}
		defer rows.Close()
		var cnt int
		
		var userDetail mystruct.UserDetail
		for rows.Next() {
			var u mystruct.UserDetail
			cnt += 1
			if (cnt >= 2) {
				w.WriteHeader(http.StatusConflict)
				return
			}
			if err := rows.Scan(&u.Id, &u.Name, &u.Email, &u.PUrl); err != nil {
				fmt.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			userDetail = u
		}

		if cnt == 0 {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		bytes, err := json.Marshal(userDetail)
		if err != nil {
			log.Printf("fail: json, Marshal, %v\n", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.Write(bytes)
		w.WriteHeader(http.StatusOK)

	default:
		return
	}
}
