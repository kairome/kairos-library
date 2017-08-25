package types

type AuthRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type SearchRequest struct {
	Query string `json:"query"`
}

type LoginRequest struct {
	AuthRequest
}

type SignupRequest struct {
	Name     string `json:"name"`
	Username string `json:"username"`
	AuthRequest
}

type ChangeNameRequest struct {
	Name string `json:"name"`
}

type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword"`
	NewPassword string `json:"newPassword"`
}

type TradeInfo struct {
	BookId    string `json:"bookId"`
	Applicant string `json:"applicant"`
}

type TradeRequest struct {
	Owner string `json:"owner"`
	TradeInfo
}

type TradeActionRequest struct {
	Type string `json:"type"`
	TradeRequest
}
