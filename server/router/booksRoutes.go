package router

import (
	"../handlers"
	"../types"
)

var BooksRoutes = types.Routes{
	types.Route{
		"FetchAllBooks",
		"GET",
		"/api/books",
		handlers.FetchAllBooksHandler,
	},
	types.Route{
		"FetchDueTime",
		"Get",
		"/api/book/due/{id}/{owner}",
		handlers.FetchDueTimeHandler,
	},
}

var ProtectedBooksRoutes = types.Routes{
	types.Route{
		"FetchMyBooks",
		"GET",
		"/books/my",
		handlers.FetchMyBooksHandler,
	},
	types.Route{
		"AddBook",
		"POST",
		"/book/{id}",
		handlers.AddBookHandler,
	},
	types.Route{
		"RemoveBook",
		"DELETE",
		"/book/{id}",
		handlers.RemoveBookHandler,
	},
}
