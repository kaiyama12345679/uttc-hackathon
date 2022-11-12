package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

var db *sql.DB

type UserResForHTTPGet struct {
	Id   string `json:"id"`
	Name string `json:"name"`
	Age  int    `json:"age"`
}

func init() {

	godotenv.Load(".env")
	mysqlUser := os.Getenv("MYSQL_USER")
	mysqlPwd := os.Getenv("MYSQL_PWD")
	mysqlHost := os.Getenv("MYSQL_HOST")
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")

	connStr := fmt.Sprintf("%s:%s@tcp(%s:3306)/%s", mysqlUser, mysqlPwd, mysqlHost, mysqlDatabase)

	// dbPool is the pool of database connections.
	dbPool, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatal(err)
	}
	if err := dbPool.Ping(); err != nil {
		log.Fatal(err)
	}

	db = dbPool
	fmt.Println("Connected")

}

func handler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
	//必要なメソッドを許可する
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

	switch r.Method {
	case http.MethodOptions:
		return
	case http.MethodGet:

		rows, err := db.Query("SELECT * FROM user")
		if err != nil {
			log.Fatal(err)
		}
		users := make([]UserResForHTTPGet, 0)
		for rows.Next() {
			var u UserResForHTTPGet
			if err := rows.Scan(&u.Id, &u.Name, &u.Age); err != nil {
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
		w.Write(bytes)

		return
	default:
		return
	}
}

func main() {
	fmt.Println("Hello, World!")
	http.HandleFunc("/api", handler)

	closeDBWithSyscall()

	log.Println("Now Listening...")
	if err := http.ListenAndServe(":8000", nil); err != nil {
		log.Fatal(err)
	}

}

func closeDBWithSyscall() {
	sig := make(chan os.Signal, 1)
	signal.Notify(sig, syscall.SIGTERM, syscall.SIGINT)
	go func() {
		s := <-sig
		log.Printf("received syscall, %v", s)

		if err := db.Close(); err != nil {
			log.Fatal(err)
		}
		log.Printf("success: db.Close()")
		os.Exit(0)
	}()
}