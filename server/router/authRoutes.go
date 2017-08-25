package router

import (
	"../handlers"
	"../types"
)

var AuthRoutes = types.Routes{
	types.Route{
		"Login",
		"POST",
		"/api/auth/login",
		handlers.LoginHandler,
	},
	types.Route{
		"Signup",
		"POST",
		"/api/auth/signup",
		handlers.SignupHandler,
	},
	types.Route{
		"Logout",
		"GET",
		"/api/auth/logout",
		handlers.LogoutHandler,
	},
}
