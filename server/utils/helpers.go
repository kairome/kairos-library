package utils

import (
	"../db"
	"../types"
	"golang.org/x/crypto/bcrypt"
	"net/http"
	"time"
)

func WriteError(error string, w http.ResponseWriter, status int) {
	http.Error(w, error, status)

	return
}

func ComparePasswords(pass1 []byte, pass2 string) error {
	var err error

	err = bcrypt.CompareHashAndPassword(pass1, []byte(pass2))

	return err
}

func GeneratePassword(password string) ([]byte, error) {
	newPass, err := bcrypt.GenerateFromPassword([]byte(password), 14)

	return newPass, err
}

func GetDueTime(expires time.Time) types.DueResponse {
	var resp string
	due := time.Until(expires)

	if due.Seconds() <= 0 {
		resp = "0h0m0s"
	} else {
		resp = due.String()
	}

	return types.DueResponse{Due: resp}
}

func RemoveRequestsInBulk(requests []types.Trade, rType string) error {
	var err error

	for _, request := range requests {
		if request.Removed == "" {
			request.Removed = rType
			_, err = db.DBMap.Update(&request)
		} else {
			_, err = db.DBMap.Delete(&request)
		}

		if err != nil {
			break
		}
	}

	return err
}
