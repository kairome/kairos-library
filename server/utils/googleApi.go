package utils

import (
	"../types"
	"encoding/json"
	"errors"
	"net/http"
	"net/url"
)

func FindGoogleBook(id string) (types.GoogleBook, error) {
	var b types.GoogleBook

	err := googleAPI("https://www.googleapis.com/books/v1/volumes/", id, &b)

	if err != nil {
		return types.GoogleBook{}, err
	}

	if b.Id == "" {
		err = errors.New("It appears the book has not been found.")
		return types.GoogleBook{}, err
	}

	return b, nil
}

func SearchGoogleBooks(query string) (types.GoogleSearchResults, error) {
	var err error
	var g types.GoogleSearchResults

	err = googleAPI("https://www.googleapis.com/books/v1/volumes?maxResults=12&orderBy=relevance&q=", query, &g)
	if err != nil {
		return types.GoogleSearchResults{}, err
	}

	if len(g.Items) == 0 {
		err = errors.New("It appears nothing was found.")
		return types.GoogleSearchResults{}, err
	}

	return g, err
}

func googleAPI(uri string, query string, response interface{}) error {
	var resp *http.Response
	var err error

	q := url.QueryEscape(query)
	resp, err = http.Get(uri + q)

	if err != nil {
		return err
	}

	defer resp.Body.Close()

	err = json.NewDecoder(resp.Body).Decode(response)

	return err
}
