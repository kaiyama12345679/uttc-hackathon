package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	mystruct "main/struct"
	"math/rand"
	"net/http"
	"time"

	"github.com/oklog/ulid"

	_ "github.com/go-sql-driver/mysql"
)

func SignUpHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	//必要なメソッドを許可する
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodPost:
		var newUser mystruct.NewUser

		if err := json.NewDecoder(r.Body).Decode(&newUser); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		queStr := fmt.Sprintf("SELECT * FROM users WHERE email_address = '%v'", newUser.Email)
		queStr2 := fmt.Sprintf("SELECT * FROM users WHERE name = '%v'", newUser.Name)
		rows, err := db.Query(queStr)
		rows2, err2 := db.Query(queStr2)
		if err != nil || err2 != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		defer rows2.Close()
		cnt := 0
		for rows.Next() {
			cnt += 1
		}
		if cnt >= 1 {
			w.WriteHeader(http.StatusConflict)
			return
		}
		cnt = 0
		for rows2.Next() {
			cnt += 1
		}
		if cnt >= 1 {
			w.WriteHeader(http.StatusPreconditionFailed)
			return
		}
		tx, err := db.Begin()

		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		ins, err := tx.Prepare("INSERT INTO users (id, name, email_address, photo_url) VALUES (?, ?, ?, ?)")

		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		t := time.Now()
		entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
		id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
		res, err := ins.Exec(id, newUser.Name, newUser.Email, newUser.PUrl)

		if err != nil {
			tx.Rollback()
			fmt.Println(err)
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

	default:
		w.WriteHeader(http.StatusBadRequest)

	}
}
