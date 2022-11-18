package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"main/struct"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func RecievedHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	//必要なメソッドを許可する
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodPost:

		var userId string
		if err := json.NewDecoder(r.Body).Decode(&userId); err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		queString := fmt.Sprintf("SELECT * FROM messages WHERE to_id = '%v'", userId)
		rows, err := db.Query(queString)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		defer rows.Close()
		messages := make([]mystruct.UserMessage, 0)
		for rows.Next() {
			var m mystruct.UserMessage
			if err := rows.Scan(&m.Id, &m.FId, &m.TId, &m.Point, &m.Message, &m.PostedTime); err != nil {
				fmt.Println(err)
				if err := rows.Close(); err != nil {
					fmt.Println(err)
				}
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			messages = append(messages, m)
		}
		bytes, err := json.Marshal(messages)
		if err != nil {
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(bytes)

	default:
		return
	}
}
