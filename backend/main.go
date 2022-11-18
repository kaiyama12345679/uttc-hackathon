package main

import (
	"database/sql"
	"fmt"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"main/api"
	"net/http"
	"os"
	"os/signal"
	"syscall"
)

var db *sql.DB

func init() {

	mysqlUser := os.Getenv("MYSQL_USER")
	mysqlPwd := os.Getenv("MYSQL_PWD")
	mysqlHost := os.Getenv("MYSQL_HOST")
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")

	connStr := fmt.Sprintf("%s:%s@%s/%s", mysqlUser, mysqlPwd, mysqlHost, mysqlDatabase)

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

func myTopPageHandler(w http.ResponseWriter, r *http.Request) {
	myapi.TopPageHandler(w, r, db)
}

func myRecievedMessageHandler(w http.ResponseWriter, r *http.Request) {
	myapi.RecievedHandler(w, r, db)
}

func mySubmittedMessageHandler(w http.ResponseWriter, r *http.Request) {
	myapi.SubmittedHandler(w, r, db)
}

func myPostHandler(w http.ResponseWriter, r *http.Request) {
	myapi.PostHandler(w, r, db)
}

func myAccountEditHandler(w http.ResponseWriter, r *http.Request) {
	myapi.AccountEditHandler(w, r, db)
}

func mySignUpHandler(w http.ResponseWriter, r *http.Request) {
	myapi.SignUpHandler(w, r, db)
}

func main() {
	fmt.Println("Hello, World!")
	http.HandleFunc("/toppage", myTopPageHandler)
	http.HandleFunc("/recieved", myRecievedMessageHandler)
	http.HandleFunc("/user/post", myPostHandler)
	http.HandleFunc("/user/submitted", mySubmittedMessageHandler)
	http.HandleFunc("/signup", mySignUpHandler)
	http.HandleFunc("/user/account-edit", myAccountEditHandler)

	closeDBWithSyscall()

	log.Println("Now Listening...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
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
