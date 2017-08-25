package router

import (
	"../middleware"
	"../types"
	"github.com/gorilla/mux"
	"github.com/urfave/negroni"
)

func assignRoutes(router *mux.Router, routes types.Routes) {
	for _, route := range routes {
		router.
			Methods(route.Method).
			Path(route.Pattern).
			Name(route.Name).
			Handler(route.HandlerFunc)
	}
}

func NewRouter() *mux.Router {
	router := mux.NewRouter()
	routes := GetRoutes()

	assignRoutes(router, routes)

	authRouter := AuthRouter()
	router.PathPrefix("/api").Handler(negroni.New(
		negroni.HandlerFunc(middleware.ValidateJWT),
		negroni.Wrap(authRouter),
	))

	return router
}

func AuthRouter() *mux.Router {
	authRouter := mux.NewRouter().PathPrefix("/api").Subrouter()
	routes := GetProtectedRoutes()

	assignRoutes(authRouter, routes)

	return authRouter
}
