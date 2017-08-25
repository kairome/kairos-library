package main

import (
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"gopkg.in/gorp.v1"
	"log"
	"os"
	"time"
)

type Trade struct {
	PK        int64     `db:"pk"`
	BookId    string    `db:"bookid"`
	Owner     string    `db:"owner"`
	Applicant string    `db:"applicant"`
	Status    string    `db:"status"`
	Removed   string    `db:"removed"`
	Expires   time.Time `db:"expires"`
}

var dbmap *gorp.DbMap

func main() {
	InitDB()

	if err := dbmap.Db.Ping(); err != nil {
		log.Fatal("Error pinging the db.\n", err)
	}

	log.Println("Expire util started.")

	for {
		checkExpiration()
		time.Sleep(1 * time.Second)
	}
}

func InitDB() {
	dbuser := os.Getenv("DB_USER")
	dbpassword := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	openQuery := fmt.Sprintf("user='%v' password='%v' dbname='%v'", dbuser, dbpassword, dbname)

	db, err := sql.Open("postgres", openQuery)
	pingErr := db.Ping()

	if err != nil || pingErr != nil {
		log.Println("Error opening db connection\n", err)
	}

	dbmap = &gorp.DbMap{Db: db, Dialect: gorp.PostgresDialect{}}
	dbmap.AddTableWithName(Trade{}, "trade").SetKeys(true, "pk")
}

func checkExpiration() {
	var requests []Trade
	_, err := dbmap.Select(&requests, "select * from trade where status='approved'")

	if err != nil {
		log.Println("Could not retrive the requests.\n", err)
	}

	for _, request := range requests {
		secLeft := time.Until(request.Expires).Seconds()
		if secLeft <= 0 {
			request.Status = "expired"

			_, err = dbmap.Update(&request)
			if err != nil {
				log.Println("Could not update the request.\n", err)
				break
			}
			log.Printf("Record %v expired.\n", request.PK)
		}
	}
}
