package utils

import (
	"../db"
	"../types"
	"strings"
	"time"
)

func NewBook(book types.GoogleBook, user string) types.Book {
	authors := strings.Join(book.VolumeInfo.Authors, ", ")
	categories := strings.Join(book.VolumeInfo.Categories, ", ")

	return types.Book{
		PK: -1,
		BookInfo: types.BookInfo{
			Id:            book.Id,
			Title:         book.VolumeInfo.Title,
			Authors:       authors,
			Description:   book.VolumeInfo.Description,
			Categories:    categories,
			PublishedDate: book.VolumeInfo.PublishedDate,
			Image:         book.VolumeInfo.Image.Thumbnail,
			InfoLink:      book.VolumeInfo.InfoLink,
			Owner:         user,
		},
	}
}

func ParseTradeBook(book types.Book) types.TradeBook {
	return types.TradeBook{
		Id:      book.Id,
		Title:   book.Title,
		Authors: book.Authors,
		Image:   book.Image,
		Owner:   book.Owner,
	}
}

func ParseTrade(requests []types.Trade) (types.TradeResponse, error) {
	var response types.TradeResponse
	var err error

	for _, request := range requests {
		var dbBook types.Book

		dbError := db.DBMap.SelectOne(&dbBook, "select * from books where id=$1 and owner=$2", request.BookId, request.Owner)

		if dbError != nil {
			err = dbError
			break
		}

		book := ParseTradeBook(dbBook)
		book.Applicant = request.Applicant

		if request.Status == "pending" {
			response.Pending = append(response.Pending, book)
		}

		if request.Status == "approved" {
			exp := time.Until(request.Expires)
			book.Due = exp.String()
			response.Approved = append(response.Approved, book)
		}

		if request.Status == "denied" {
			response.Denied = append(response.Denied, book)
		}

		if request.Status == "expired" {
			response.Expired = append(response.Expired, book)
		}
	}

	if err != nil {
		return types.TradeResponse{}, err
	}

	return response, nil
}

func ParseLoanedBooks(requests []types.Trade) ([]types.LoanedBook, error) {
	var results []types.LoanedBook
	var err error

	for _, request := range requests {
		var dbBook types.Book
		err = db.DBMap.SelectOne(&dbBook, "select * from books where id=$1 and owner=$2", request.BookId, request.Owner)
		if err != nil {
			break
		}

		parsed := parseBook(dbBook)
		due := time.Until(request.Expires)

		loanedBook := types.LoanedBook{
			BookInfo: parsed,
			Due:      due.String(),
		}

		results = append(results, loanedBook)
	}

	return results, err
}

func parseBook(book types.Book) types.BookInfo {
	return types.BookInfo{
		Id:            book.Id,
		Title:         book.Title,
		Authors:       book.Authors,
		Description:   book.Description,
		Categories:    book.Categories,
		PublishedDate: book.PublishedDate,
		Image:         book.Image,
		InfoLink:      book.InfoLink,
		Owner:         book.Owner,
	}

}

func ParseBooks(books interface{}) []types.BookInfo {
	var parsedResutls []types.BookInfo

	if searchResults, ok := books.(types.GoogleSearchResults); ok {
		for _, book := range searchResults.Items {
			authors := strings.Join(book.VolumeInfo.Authors, ", ")
			categories := strings.Join(book.VolumeInfo.Categories, ", ")

			newBook := types.BookInfo{
				Id:            book.Id,
				Title:         book.VolumeInfo.Title,
				Authors:       authors,
				Description:   book.VolumeInfo.Description,
				Categories:    categories,
				PublishedDate: book.VolumeInfo.PublishedDate,
				Image:         book.VolumeInfo.Image.Thumbnail,
				InfoLink:      book.VolumeInfo.InfoLink,
			}

			parsedResutls = append(parsedResutls, newBook)
		}

		return parsedResutls
	}

	if dbBooks, ok := books.(types.Books); ok {
		for _, book := range dbBooks {

			newBook := parseBook(book)

			parsedResutls = append(parsedResutls, newBook)
		}

		return parsedResutls
	}

	return []types.BookInfo{}
}
