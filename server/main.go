package main

import (
	"./db"
	"./keys"
	"./middleware"
	"./router"
	"github.com/urfave/negroni"
	"github.com/gorilla/handlers"
	"os"
)

func main() {
	keys.Init()
	db.Init()

	defer db.DBMap.Db.Close()
	r := router.NewRouter()

	n := negroni.Classic()
	n.Use(negroni.HandlerFunc(middleware.VerifyDatabase))
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"})
	headersOk := handlers.AllowedHeaders([]string{"X-REQUESTED-WITH", "content-type"})

	n.UseHandler(handlers.CORS(handlers.AllowCredentials(), originsOk, methodsOk, headersOk)(r))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8000"
	}

	serverUrl := ":" + port
	n.Run(serverUrl)
}
