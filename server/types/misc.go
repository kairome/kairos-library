package types

import (
	"net/http"
	"time"
)

/**** User ****/

type User struct {
	Name     string `db:"name"`
	Username string `db:"username"`
	Email    string `db:"email"`
	Password []byte `db:"password"`
}

/**** Google API ****/

type GoogleBook struct {
	Id         string `json:"id"`
	VolumeInfo struct {
		Title         string   `json:"title"`
		Authors       []string `json:"authors"`
		Description   string   `json:"description"`
		Categories    []string `json:"categories"`
		PublishedDate string   `json:"publishedDate"`
		Image         struct {
			Thumbnail string `json:"thumbnail"`
		} `json:"imageLinks"`
		InfoLink string `json:"infoLink"`
	} `json:"volumeInfo"`
}

type GoogleSearchResults struct {
	Items []GoogleBook `json:"items"`
}

/**** Trade ****/

type Trade struct {
	PK        int64     `db:"pk"`
	BookId    string    `db:"bookid"`
	Owner     string    `db:"owner"`
	Applicant string    `db:"applicant"`
	Status    string    `db:"status"`
	Removed   string    `db:"removed"`
	Expires   time.Time `db:"expires"`
}

/**** Router types ****/

type Route struct {
	Name        string
	Method      string
	Pattern     string
	HandlerFunc http.HandlerFunc
}

type Routes []Route
