package db

import (
	"../types"
	"database/sql"
	"fmt"
	_ "github.com/lib/pq"
	"gopkg.in/gorp.v1"
	"log"
	"os"
)

var DBMap *gorp.DbMap

func newDB() *sql.DB {
	dbuser := os.Getenv("DB_USER")
	dbpassword := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	openQuery := fmt.Sprintf("user='%v' password='%v' dbname='%v'", dbuser, dbpassword, dbname)

	db, err := sql.Open("postgres", openQuery)
	pingErr := db.Ping()
	if err != nil || pingErr != nil {
		log.Fatal("Error opening db connection\n", err, pingErr)
		return &sql.DB{}
	}

	return db
}

func Init() {
	DBMap = &gorp.DbMap{Db: newDB(), Dialect: gorp.PostgresDialect{}}
	DBMap.AddTableWithName(types.Book{}, "books").SetKeys(true, "pk")
	usersTable := DBMap.AddTableWithName(types.User{}, "users").SetKeys(false, "email")
	usersTable.Columns[1].SetUnique(true)
	DBMap.AddTableWithName(types.Trade{}, "trade").SetKeys(true, "pk")
	DBMap.CreateTablesIfNotExists()
}
