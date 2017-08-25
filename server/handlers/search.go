package handlers

import (
	"../types"
	"../utils"
	"net/http"
)

func SearchHandler(w http.ResponseWriter, r *http.Request) {
	var err error

	// parse the request
	var searchRequest types.SearchRequest
	utils.JsonRequest(&searchRequest, w, r)

	// get the results from GoogleBooks API
	var results types.GoogleSearchResults
	results, err = utils.SearchGoogleBooks(searchRequest.Query)
	if err != nil {
		utils.WriteError(err.Error(), w, http.StatusInternalServerError)
		return
	}

	parsedResults := utils.ParseBooks(results)

	// encode the results and send them
	utils.JsonResponse(parsedResults, w)
}
