package router

import (
	"../handlers"
	"../types"
)

var PingRoute = types.Route{
	"Ping",
	"GET",
	"/api/ping",
	handlers.PingHandler,
}

var SearchRoute = types.Route{
	"Search",
	"POST",
	"/api/books/search",
	handlers.SearchHandler,
}

func GetRoutes() types.Routes {
	var appRoutes types.Routes

	appRoutes = append(appRoutes, PingRoute, SearchRoute)

	routes := []types.Routes{
		BooksRoutes,
		AuthRoutes,
	}

	for _, r := range routes {
		appRoutes = append(appRoutes, r...)
	}

	return appRoutes
}

func GetProtectedRoutes() types.Routes {
	var protectedRoutes types.Routes

	routes := []types.Routes{
		UserRoutes,
		ProtectedBooksRoutes,
		TradeRoutes,
	}

	for _, r := range routes {
		protectedRoutes = append(protectedRoutes, r...)
	}

	return protectedRoutes
}
