package myapi

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"main/struct"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

func SubmittedHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
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
		queString := fmt.Sprintf("SELECT * FROM messages WHERE from_id = '%v'", userId)
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
				fmt.Println("point5", err)
				if err := rows.Close(); err != nil {
					fmt.Println("point3", err)
				}
				w.WriteHeader(http.StatusInternalServerError)
				return
			}
			messages = append(messages, m)
		}
		bytes, err := json.Marshal(messages)
		if err != nil {
			fmt.Println("point4", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(bytes)
	case http.MethodDelete:
		var messageId string

		if err := json.NewDecoder(r.Body).Decode(&messageId); err != nil {
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
		queStr := fmt.Sprintf("DELETE FROM messages WHERE id = '%v'", messageId)
		stmt, err := tx.Prepare(queStr)
		if err != nil {
			stmt.Close()
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if res, err := stmt.Exec(); err != nil {
			tx.Rollback()
			fmt.Println(res.RowsAffected())
			fmt.Println(err)
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

	case http.MethodPut:
		var editMessage mystruct.EditMessage

		if err := json.NewDecoder(r.Body).Decode(&editMessage); err != nil {
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
		queStr := fmt.Sprintf("UPDATE messages SET point = '%v', message = '%v' WHERE id = '%v'",
			editMessage.Point, editMessage.Message, editMessage.Id)
		stmt, err := tx.Prepare(queStr)
		if err != nil {
			stmt.Close()
			tx.Rollback()
			fmt.Println(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		if res, err := stmt.Exec(); err != nil {
			tx.Rollback()
			fmt.Println(res.RowsAffected())
			fmt.Println(err)
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
		return
	}
}
