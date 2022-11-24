package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"github.com/oklog/ulid"
	"main/struct"
	"math/rand"
	"net/http"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

func PostHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	//必要なメソッドを許可する
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodPost:
		var message mystruct.SubmitMessage
		if err := json.NewDecoder(r.Body).Decode(&message); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		tx, err := db.Begin()
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		ins, err := tx.Prepare("INSERT INTO messages (id, from_id, to_id, point, message, posted_time) VALUES(?, ?, ?, ?, ?, ?)")
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		t := time.Now()
		tokyo, err := time.LoadLocation("Asia/Tokyo")
		if err != nil {
			return err
		}
		localt := t.In(tokyo)
		myTime := localt.Format("2006/1/2 15:04:05")
		entropy := ulid.Monotonic(rand.New(rand.NewSource(t.UnixNano())), 0)
		id := ulid.MustNew(ulid.Timestamp(t), entropy).String()
		res, err := ins.Exec(id, message.FId, message.TId, message.Point, message.Message, myTime.String())
		if err != nil {
			tx.Rollback()
			fmt.Print(err)
			fmt.Println(res.LastInsertId())
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if err != nil {
			tx.Rollback()
			fmt.Println(err)
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
