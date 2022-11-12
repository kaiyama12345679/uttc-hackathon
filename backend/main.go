package main

import (
	"crypto/tls"
	"crypto/x509"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"github.com/go-sql-driver/mysql"
	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
	"io/ioutil"
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
	// (OPTIONAL) Configure SSL certificates
	// For deployments that connect directly to a Cloud SQL instance without
	// using the Cloud SQL Proxy, configuring SSL certificates will ensure the
	// connection is encrypted.
	dbRootCert := os.Getenv("DB_ROOT_CERT") // e.g., '/path/to/my/server-ca.pem'
	var (
		dbCert = os.Getenv("DB_CERT") // e.g. '/path/to/my/client-cert.pem'
		dbKey  = os.Getenv("DB_KEY")  // e.g. '/path/to/my/client-key.pem'
	)
	pool := x509.NewCertPool()
	pem, err := ioutil.ReadFile(dbRootCert)
	if err != nil {
		log.Fatal(err)
	}
	if ok := pool.AppendCertsFromPEM(pem); !ok {
		log.Fatal(fmt.Errorf("err"))
	}
	cert, err := tls.LoadX509KeyPair(dbCert, dbKey)
	if err != nil {
		log.Fatal(err)
	}
	mysql.RegisterTLSConfig("cloudsql", &tls.Config{
		RootCAs:               pool,
		Certificates:          []tls.Certificate{cert},
		InsecureSkipVerify:    true,
		VerifyPeerCertificate: verifyPeerCertFunc(pool),
	})
	connStr += "&tls=cloudsql"

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

func verifyPeerCertFunc(pool *x509.CertPool) func([][]byte, [][]*x509.Certificate) error {
	return func(rawCerts [][]byte, _ [][]*x509.Certificate) error {
		if len(rawCerts) == 0 {
			return errors.New("no certificates available to verify")
		}

		cert, err := x509.ParseCertificate(rawCerts[0])
		if err != nil {
			return err
		}

		opts := x509.VerifyOptions{Roots: pool}
		if _, err = cert.Verify(opts); err != nil {
			return err
		}
		return nil
	}
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
