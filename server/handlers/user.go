package handlers

import (
	"../db"
	"../types"
	"../utils"
	"net/http"
)

func ChangeNameHandler(w http.ResponseWriter, r *http.Request) {
	var request types.ChangeNameRequest
	var err error

	utils.JsonRequest(&request, w, r)

	if request.Name == "" {
		utils.WriteError("Wrong payload.", w, http.StatusInternalServerError)
		return
	}

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	_, err = db.DBMap.Exec("update users set name=$1 where username=$2", request.Name, user)

	if err != nil {
		utils.WriteError("Something went wrong. The  name is not updated", w, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func ChangePasswordHandler(w http.ResponseWriter, r *http.Request) {
	var request types.ChangePasswordRequest
	var user types.User
	var err error

	utils.JsonRequest(&request, w, r)

	if request.OldPassword == "" || request.NewPassword == "" {
		utils.WriteError("Wrong payload.", w, http.StatusInternalServerError)
		return
	}

	username, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// check old password
	err = db.DBMap.SelectOne(&user, "select * from users where username=$1", username)

	if err != nil {
		utils.WriteError("Something went wrong. User is unavailable.", w, http.StatusInternalServerError)
		return
	}

	err = utils.ComparePasswords(user.Password, request.OldPassword)

	if err != nil {
		utils.WriteError("Provided current password is incorrect.", w, http.StatusInternalServerError)
		return
	}

	// hash new password
	newPass, err := utils.GeneratePassword(request.NewPassword)
	if err != nil {
		utils.WriteError("Something went wrong. Password not created", w, http.StatusInternalServerError)
		return
	}

	// update the db
	_, err = db.DBMap.Exec("update users set password=$1 where username=$2", newPass, username)
	if err != nil {
		utils.WriteError("Something went wrong. Could not update the password.", w, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
