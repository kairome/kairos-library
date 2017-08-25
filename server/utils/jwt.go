package utils

import (
	"../keys"
	"fmt"
	"github.com/dgrijalva/jwt-go"
	"net/http"
	"time"
)

func GenerateToken(expiration time.Time, username string) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodRS256, jwt.MapClaims{
		"iss":  "admin",
		"exp":  expiration.Unix(),
		"user": username,
	})

	t, err := token.SignedString(keys.SigningKey)
	return t, err
}

func GetUserFromJWT(w http.ResponseWriter, r *http.Request) (string, error) {
	tokenString, err := GetJWTCookie(w, r)

	if err != nil {
		return "", err
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodRSA); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return keys.VerifyingKey, nil
	})

	if token == nil {
		return "", err
	}

	claims, ok := token.Claims.(jwt.MapClaims)

	if ok && token.Valid {
		user := claims["user"]
		if u, ok := user.(string); ok {
			return u, nil
		}
	}

	return "", fmt.Errorf("Bad claims or token is invalid.")
}
