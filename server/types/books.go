package types

type BookInfo struct {
	Id            string `db:"id" json:"id"`
	Title         string `db:"title" json:"title"`
	Authors       string `db:"authors" json:"authors"`
	Description   string `db:"description" json:"description"`
	Categories    string `db:"categories" json:"categories"`
	PublishedDate string `db:"publishedDate" json:"publishedDate"`
	Image         string `db:"image" json:"image"`
	InfoLink      string `db:"infoLink" json:"infoLink"`
	Owner         string `db:"owner" json:"owner"`
}

type Book struct {
	PK int64 `db:"pk" json:"pk"`
	BookInfo
}

type Books []Book

type TradeBook struct {
	Id        string `json:"id"`
	Title     string `json:"title"`
	Authors   string `json:"authors"`
	Image     string `json:"image"`
	Owner     string `json:"owner"`
	Applicant string `json:"applicant"`
	Due       string `json:"due"`
}

type LoanedBook struct {
	BookInfo
	Due string `json:"due"`
}
