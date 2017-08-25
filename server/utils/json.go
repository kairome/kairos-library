package utils

import (
	"encoding/json"
	"net/http"
)

func JsonResponse(response interface{}, w http.ResponseWriter) {
	err := json.NewEncoder(w).Encode(response)
	if err != nil {
		WriteError(err.Error(), w, http.StatusInternalServerError)
	}
}

func JsonRequest(request interface{}, w http.ResponseWriter, r *http.Request) {
	err := json.NewDecoder(r.Body).Decode(request)
	if err != nil {
		WriteError(err.Error(), w, http.StatusInternalServerError)
	}
}
