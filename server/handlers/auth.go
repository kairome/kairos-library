package handlers

import (
	"../db"
	"../types"
	"../utils"
	"fmt"
	"net/http"
	"regexp"
	"time"
)

func LoginHandler(w http.ResponseWriter, r *http.Request) {
	var loginRequest types.LoginRequest
	var err error

	// parse the request and check if user exists
	utils.JsonRequest(&loginRequest, w, r)

	if loginRequest.Email == "" || loginRequest.Password == "" {
		utils.WriteError("Wrong payload.", w, http.StatusInternalServerError)
		return
	}

	user, err := db.DBMap.Get(types.User{}, loginRequest.Email)
	if user == nil {
		utils.WriteError("Oops, seems you have to sign up first!", w, http.StatusInternalServerError)
		return
	}

	if err != nil {
		utils.WriteError("Something went wrong. Could not verify user's identity.", w, http.StatusInternalServerError)
		return
	}

	// check if the password is correct
	u := user.(*types.User)

	err = utils.ComparePasswords(u.Password, loginRequest.Password)
	if err != nil {
		utils.WriteError("Wrong email/password. Try again.", w, http.StatusForbidden)
		return
	}

	// create a JWT token and save it in cookies
	expiration := time.Now().Add(72 * time.Hour)

	tokenString, err := utils.GenerateToken(expiration, u.Username)

	if err != nil {
		utils.WriteError("Something went wrong. JWT is invalid.", w, http.StatusInternalServerError)
		return
	}

	utils.SetJWTCookie(w, tokenString, expiration)

	// create a response and send it
	authResponse := types.AuthResponse{
		Name:     u.Name,
		Username: u.Username,
	}

	utils.JsonResponse(authResponse, w)
}

func SignupHandler(w http.ResponseWriter, r *http.Request) {
	var signupRequest types.SignupRequest
	var err error
	var secret []byte

	utils.JsonRequest(&signupRequest, w, r)

	if signupRequest.Email == "" || signupRequest.Password == "" || signupRequest.Username == "" {
		utils.WriteError("Wrong payload.", w, http.StatusInternalServerError)
		return
	}

	secret, err = utils.GeneratePassword(signupRequest.Password)
	if err != nil {
		utils.WriteError("Something went wrong. Password not created.", w, http.StatusInternalServerError)
		return
	}

	newUser := types.User{
		Name:     signupRequest.Name,
		Username: signupRequest.Username,
		Email:    signupRequest.Email,
		Password: secret,
	}

	// Make email and username unique
	err = db.DBMap.Insert(&newUser)

	if err != nil {
		var msg string
		emailConstraint, _ := regexp.Compile("unique constraint \"users_pkey\"")
		usernameConstraint, _ := regexp.Compile("unique constraint \"users_username_key\"")
		error := err.Error()

		if emailConstraint.MatchString(error) {
			msg = fmt.Sprintf("User with this email is already registered.")
		} else if usernameConstraint.MatchString(error) {
			msg = fmt.Sprintf("This username is already taken.")
		} else {
			msg = "Something went wrong. User is not created."
		}

		utils.WriteError(msg, w, http.StatusInternalServerError)
		return
	}

	// create a JWT token and save it in cookies
	expiration := time.Now().Add(72 * time.Hour)

	tokenString, err := utils.GenerateToken(expiration, signupRequest.Username)

	if err != nil {
		utils.WriteError("Something went wrong. JWT is invalid.", w, http.StatusInternalServerError)
		return
	}

	utils.SetJWTCookie(w, tokenString, expiration)

	// create a response and send it
	authResponse := types.AuthResponse{
		Name:     signupRequest.Name,
		Username: signupRequest.Username,
	}

	utils.JsonResponse(authResponse, w)
}

func LogoutHandler(w http.ResponseWriter, r *http.Request) {
	cookie := http.Cookie{Name: "JWT", Value: "", MaxAge: -1, Expires: time.Now().Add(-1 * time.Hour), Path: "/", HttpOnly: true}
	http.SetCookie(w, &cookie)
	w.WriteHeader(http.StatusOK)
}
