package utils

import (
	"errors"
	"net/http"
	"time"
)

func SetJWTCookie(w http.ResponseWriter, token string, expiration time.Time) {
	cookie := http.Cookie{Name: "JWT", Value: token, Expires: expiration, Path: "/", HttpOnly: true}
	http.SetCookie(w, &cookie)
}

func GetJWTCookie(w http.ResponseWriter, r *http.Request) (string, error) {
	cookie, err := r.Cookie("JWT")

	if err != nil {
		var msg string

		if err.Error() == "http: named cookie not present" {
			msg = "Unauthorized."
		} else {
			msg = "Something went wrong. Cookie is not retrieved."
		}

		return "", errors.New(msg)
	}

	tokenString := cookie.Value
	if tokenString == "" {
		return "", errors.New("Unauthorized.")
	}

	return tokenString, nil
}
