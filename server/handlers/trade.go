package handlers

import (
	"../db"
	"../types"
	"../utils"
	"fmt"
	"github.com/gorilla/mux"
	"net/http"
	"time"
)

func RequestTradeHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	var request types.TradeRequest
	utils.JsonRequest(&request, w, r)

	if request.BookId == "" || request.Owner == "" || request.Applicant == "" {
		utils.WriteError("Wrong payload.", w, http.StatusInternalServerError)
		return
	}

	// check if the applicant is the one with JWT
	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	if user != request.Applicant {
		utils.WriteError("Applicant is not the person he claims to be.", w, http.StatusForbidden)
		return
	}

	// check if owner and applicant are the same person
	if request.Owner == request.Applicant {
		utils.WriteError("Applicant and owner cannot be the same person.", w, http.StatusForbidden)
		return
	}

	var tradeRequest types.Trade
	err = db.DBMap.SelectOne(&tradeRequest, "select * from trade where bookid=$1 and applicant=$2 and owner=$3", request.BookId, request.Applicant, request.Owner)

	if err != nil && err.Error() != "sql: no rows in result set" {
		utils.WriteError("Something went wrong. Could not select trade books.", w, http.StatusInternalServerError)
		return
	}

	if tradeRequest.Status == "pending" {
		utils.WriteError("Cannot request the same book twice", w, http.StatusInternalServerError)
		return
	}

	if tradeRequest.Status == "approved" {
		utils.WriteError("Cannot request the approved book.", w, http.StatusInternalServerError)
		return
	}

	var alreadyLoaned []types.Trade
	_, err = db.DBMap.Select(&alreadyLoaned, "select * from trade where bookid=$1 and owner=$2 and status='approved'", request.BookId, request.Owner)

	if err != nil {
		utils.WriteError("Something went wrong. Could not select trade books.", w, http.StatusInternalServerError)
		return
	}

	if len(alreadyLoaned) > 0 {
		due := time.Until(alreadyLoaned[0].Expires).String()
		msg := fmt.Sprintf("Unfortunately, the book has been loaned already. It is due in %v", due)
		utils.WriteError(msg, w, http.StatusInternalServerError)
		return
	}

	// check if there's a book with such id belonging to that user
	err = db.DBMap.SelectOne(&types.Book{}, "select * from books where id=$1 and owner=$2", request.BookId, request.Owner)

	if err != nil {
		utils.WriteError("Provided owner has no such book belonging to him.", w, http.StatusInternalServerError)
		return
	}

	if tradeRequest.Status == "expired" || tradeRequest.Status == "denied" {
		tradeRequest.Status = "pending"
		tradeRequest.Expires = time.Time{}
		tradeRequest.Removed = ""
		_, err = db.DBMap.Update(&tradeRequest)

		if err != nil {
			utils.WriteError("Something went wrong. Trade request has not been submitted.", w, http.StatusInternalServerError)
			return
		}
	} else {
		trade := types.Trade{
			BookId:    request.BookId,
			Owner:     request.Owner,
			Applicant: request.Applicant,
			Status:    "pending",
		}

		err = db.DBMap.Insert(&trade)
		if err != nil {
			utils.WriteError("Something went wrong. Trade request has been aborted.", w, http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusNoContent)
}

func MyRequestsHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	var myRequests []types.Trade

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	_, err = db.DBMap.Select(&myRequests, "select * from trade where applicant=$1 and removed!='my'", user)

	if err != nil {
		utils.WriteError("Something went wrong. Could not get user's trade requests", w, http.StatusInternalServerError)
		return
	}

	response, err := utils.ParseTrade(myRequests)

	if err != nil {
		utils.WriteError("Something went wrong. Could not retrieve trade requests", w, http.StatusInternalServerError)
		return
	}

	utils.JsonResponse(response, w)
}

func ReceivedRequestsHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	var receivedRequests []types.Trade

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	_, err = db.DBMap.Select(&receivedRequests, "select * from trade where owner=$1 and removed!='received'", user)

	if err != nil {
		utils.WriteError("Something went wrong. Could not get user's trade requests", w, http.StatusInternalServerError)
		return
	}

	response, err := utils.ParseTrade(receivedRequests)

	if err != nil {
		utils.WriteError("Something went wrong. Could not retrieve trade requests", w, http.StatusInternalServerError)
		return
	}

	utils.JsonResponse(response, w)
}

func RemoveTradeRequestHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	var request types.TradeActionRequest
	utils.JsonRequest(&request, w, r)

	if request.BookId == "" || request.Applicant == "" || request.Type == "" || request.Owner == "" {
		utils.WriteError("Malformed request.", w, http.StatusInternalServerError)
		return
	}

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	if request.Type == "my" {
		if request.Applicant != user {
			utils.WriteError("Applicant and user must be the same person.", w, http.StatusInternalServerError)
			return
		}
	} else if request.Type == "received" {
		if request.Owner != user {
			utils.WriteError("Owner and user must be the same person", w, http.StatusInternalServerError)
			return
		}

	} else {
		utils.WriteError("Unknown request type.", w, http.StatusInternalServerError)
		return
	}

	var trade types.Trade

	err = db.DBMap.SelectOne(&trade, "select * from trade where bookid=$1 and applicant=$2 and owner=$3", request.BookId, request.Applicant, request.Owner)

	if err != nil {
		utils.WriteError("Applicant has no trade request for the book.", w, http.StatusInternalServerError)
		return
	}

	if trade.Removed == request.Type {
		utils.WriteError("Cannot remove the request twice.", w, http.StatusInternalServerError)
		return
	}

	if trade.Status == "denied" || trade.Status == "expired" {
		if trade.Removed == "" {
			trade.Removed = request.Type
			_, err = db.DBMap.Update(&trade)
			if err != nil {
				utils.WriteError("Something went wrong. The request has not been removed.", w, http.StatusInternalServerError)
				return
			}

			w.WriteHeader(http.StatusNoContent)
			return
		}

		_, err := db.DBMap.Delete(&trade)

		if err != nil {
			utils.WriteError("Something went wrong. The record has not been removed.", w, http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusNoContent)
		return
	}

	utils.WriteError("Cannot remove pending or approved requests.", w, http.StatusInternalServerError)
	return

}

func TradeRequestActionHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	var request types.TradeActionRequest
	var trade types.Trade

	utils.JsonRequest(&request, w, r)

	if request.BookId == "" || request.Applicant == "" || request.Type == "" {
		utils.WriteError("Malformed request", w, http.StatusInternalServerError)
		return
	}

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	err = db.DBMap.SelectOne(&trade, "select * from trade where bookid=$1 and applicant=$2 and owner=$3 and status='pending'", request.BookId, request.Applicant, user)
	if err != nil {
		utils.WriteError("Applicant has no trade request for the book.", w, http.StatusInternalServerError)
		return
	}

	if request.Type == "deny" {
		trade.Status = "denied"
	} else if request.Type == "approve" {
		if !trade.Expires.IsZero() {
			utils.WriteError("Something went wrong. Expiration date is not what it should be.", w, http.StatusInternalServerError)
			return
		}

		trade.Status = "approved"
		trade.Expires = time.Now().Add(10 * time.Minute)

		// change all the rest requests for the book to 'denied'
		_, err = db.DBMap.Exec("update trade set status='denied' where bookid=$1 and applicant != $2", request.BookId, request.Applicant)

		if err != nil {
			utils.WriteError("Something went wrong. Could not update the requests.", w, http.StatusInternalServerError)
			return
		}

	} else {
		utils.WriteError("Unknown type.", w, http.StatusInternalServerError)
		return
	}

	_, err = db.DBMap.Update(&trade)
	if err != nil {
		utils.WriteError("Something went wrong. The request has not been approved.", w, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}

func RemoveRequestsBulkHandler(w http.ResponseWriter, r *http.Request) {
	var err error

	user, err := utils.GetUserFromJWT(w, r)

	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	requestsType := mux.Vars(r)["type"]
	requestStatus := mux.Vars(r)["status"]

	if requestStatus != "expired" && requestStatus != "denied" {
		utils.WriteError("Can only remove requests with status of expired or denied.", w, http.StatusInternalServerError)
		return
	}

	var requests []types.Trade

	if requestsType == "my" {
		_, err = db.DBMap.Select(&requests, "select * from trade where applicant=$1 and status=$2 and removed!='my'", user, requestStatus)
	} else if requestsType == "received" {
		_, err = db.DBMap.Select(&requests, "select * from trade where owner=$1 and status=$2 and removed!='received'", user, requestStatus)
	} else {
		utils.WriteError("Unknown type of requests.", w, http.StatusInternalServerError)
		return
	}

	if err != nil {
		utils.WriteError("Could not retrieve the requests.", w, http.StatusInternalServerError)
		return
	}

	err = utils.RemoveRequestsInBulk(requests, requestsType)
	if err != nil {
		utils.WriteError("Something went wrong. Requests have not been removed.", w, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
