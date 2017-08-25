package router

import (
	"../handlers"
	"../types"
)

var UserRoutes = types.Routes{
	types.Route{
		"ChangeName",
		"POST",
		"/user/name",
		handlers.ChangeNameHandler,
	},
	types.Route{
		"ChangePassword",
		"POST",
		"/user/password",
		handlers.ChangePasswordHandler,
	},
}
