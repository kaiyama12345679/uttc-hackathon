package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/oklog/ulid"
	"math/rand"
	"net/http"
	"time"

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
		var user string

		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		queStr := fmt.Sprintf("SELECT * FROM users WHERE name = '%v'", user)

		rows, err := db.Query(queStr)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		cnt := 0
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
		ins, err := tx.Prepare("INSERT INTO users (id, name) VALUES (?, ?)")

		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		t := time.Now()
		entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
		id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
		res, err := ins.Exec(id, user)

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
