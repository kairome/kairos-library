package middleware

import (
	"../db"
	"../keys"
	"../utils"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
)

func VerifyDatabase(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	w.Header().Set("Content-Type", "application/json")
	if err := db.DBMap.Db.Ping(); err != nil {
		utils.WriteError("Records are not available at the moment.", w, http.StatusInternalServerError)
		return
	}

	next(w, r)
}

func ValidateJWT(w http.ResponseWriter, r *http.Request, next http.HandlerFunc) {
	tokenString, err := utils.GetJWTCookie(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusUnauthorized)
		return
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return keys.VerifyingKey, nil
	})

	if token == nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	if !token.Valid {
		utils.WriteError("Access denied. Unauthorized.", w, http.StatusUnauthorized)
		return
	}

	next(w, r)
}
