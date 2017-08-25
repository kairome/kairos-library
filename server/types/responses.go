package types

type AuthResponse struct {
	Name     string `json:"name"`
	Username string `json:"username"`
}

type BookResponse struct {
	Books  []BookInfo   `json:"books"`
	Loaned []LoanedBook `json:"loaned"`
}

type TradeResponse struct {
	Pending  []TradeBook `json:"pending"`
	Approved []TradeBook `json:"approved"`
	Denied   []TradeBook `json:"denied"`
	Expired  []TradeBook `json:"expired"`
}

type DueResponse struct {
	Due string `json:"due"`
}
