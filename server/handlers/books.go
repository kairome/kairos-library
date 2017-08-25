package handlers

import (
	"../db"
	"../types"
	"../utils"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
)

func AddBookHandler(w http.ResponseWriter, r *http.Request) {
	var err error

	id, _ := mux.Vars(r)["id"]

	if id == "" {
		utils.WriteError("Malformed request.", w, http.StatusInternalServerError)
		return
	}

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// check if the book already exists
	count, err := db.DBMap.SelectInt("select count(*) from books where id=$1 and owner=$2", id, user)

	if err != nil {
		utils.WriteError("Something went wrong. Could not verify the book's unique.", w, http.StatusInternalServerError)
		return
	}

	if count > 0 {
		utils.WriteError("The book already exists in your collection.", w, http.StatusInternalServerError)
		return
	}

	var book types.GoogleBook

	// call google API
	book, err = utils.FindGoogleBook(id)

	msg := fmt.Sprintf("Book with id %v not found.", id)
	if err != nil {
		utils.WriteError(msg, w, http.StatusInternalServerError)
		return
	}

	// store the result in the db
	newBook := utils.NewBook(book, user)
	err = db.DBMap.Insert(&newBook)
	if err != nil {
		utils.WriteError("Something went wrong. The book is not added.", w, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func FetchMyBooksHandler(w http.ResponseWriter, r *http.Request) {
	var myBooks types.Books
	var err error

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// get the books belonging to the user
	_, err = db.DBMap.Select(&myBooks, "select * from books where owner=$1", user)

	if err != nil {
		utils.WriteError("Something went wrong. Could not retrieve your books.", w, http.StatusInternalServerError)
		return
	}

	// remove the ones the user loaned to somebody else
	var givenAway []types.Trade
	_, err = db.DBMap.Select(&givenAway, "select * from trade where owner=$1 and status='approved'", user)

	for _, b := range givenAway {
		for i, myBook := range myBooks {
			if b.BookId == myBook.Id {
				myBooks = append(myBooks[:i], myBooks[i+1:]...)
			}
		}
	}

	// get the ones the user rented himself
	var loaned []types.Trade
	_, err = db.DBMap.Select(&loaned, "select * from trade where applicant=$1 and status='approved'", user)

	if err != nil {
		utils.WriteError("Could not retrieve trade information.", w, http.StatusInternalServerError)
		return
	}

	parsedBooks := utils.ParseBooks(myBooks)
	loanedBooks, err := utils.ParseLoanedBooks(loaned)

	if err != nil {
		utils.WriteError("Something went wrong. Could not retrieve loaned books.", w, http.StatusInternalServerError)
		return
	}

	result := types.BookResponse{
		Books:  parsedBooks,
		Loaned: loanedBooks,
	}

	utils.JsonResponse(result, w)
}

func FetchAllBooksHandler(w http.ResponseWriter, r *http.Request) {
	var allBooks types.Books

	_, err := db.DBMap.Select(&allBooks, "select * from books")
	if err != nil {
		utils.WriteError("Something went wrong. Could not retrieve books.", w, http.StatusInternalServerError)
		return
	}

	parsedResults := utils.ParseBooks(allBooks)

	utils.JsonResponse(parsedResults, w)
}

func RemoveBookHandler(w http.ResponseWriter, r *http.Request) {
	var err error

	id, _ := mux.Vars(r)["id"]

	if id == "" {
		utils.WriteError("Malformed request.", w, http.StatusInternalServerError)
		return
	}

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	// check if the book exists
	count, err := db.DBMap.SelectInt("select count(*) from books where id=$1 and owner=$2", id, user)

	if err != nil {
		utils.WriteError("Something went wrong. Could not verify the book exists.", w, http.StatusInternalServerError)
		return
	}

	if count == 0 {
		utils.WriteError("Cannot delete the non-existent record.", w, http.StatusInternalServerError)
		return
	}

	// check that the book has not been loaned
	count, err = db.DBMap.SelectInt("select count(*) from trade where bookid=$1 and owner=$2 and status='approved'", id, user)

	if err != nil {
		utils.WriteError("Something went wrong. Could not verify the book is not loaned.", w, http.StatusInternalServerError)
		return
	}

	if count > 0 {
		utils.WriteError("Cannot delete a book that's on loan.", w, http.StatusInternalServerError)
		return
	}

	// delete the book from trade table
	_, err = db.DBMap.Exec("delete from trade where bookid=$1 and owner=$2", id, user)

	if err != nil {
		utils.WriteError("Something went wrong. The book is not removed from trade.", w, http.StatusInternalServerError)
		return
	}

	// delete the book from books table
	_, err = db.DBMap.Exec("delete from books where id=$1 and owner=$2", id, user)

	if err != nil {
		utils.WriteError("Something went wrong. The book is not removed.", w, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func FetchDueTimeHandler(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]
	owner := mux.Vars(r)["owner"]

	if id == ""  || owner == "" {
		utils.WriteError("Malformed request.", w, http.StatusInternalServerError)
		return
	}

	var trade types.Trade
	err := db.DBMap.SelectOne(&trade, "select expires from trade where bookid=$1 and owner=$2 and status='approved'", id, owner)

	if err != nil {
		if err.Error() == "sql: no rows in result set" {
			utils.JsonResponse(types.DueResponse{Due: "0h0m0s"}, w)
			return
		}

		utils.WriteError("Could not retrieve the due time.", w, http.StatusInternalServerError)
		return
	}

	due := utils.GetDueTime(trade.Expires)

	utils.JsonResponse(due, w)
}
