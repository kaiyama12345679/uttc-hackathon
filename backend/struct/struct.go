package mystruct

type UserResForHTTPGet struct {
	Id     string `json:"id"`
	Name   string `json:"name"`
	Points int    `json:"points"`
}

type UserMessage struct {
	Id         string `json:"id"`
	FId        string `json:"from_id"`
	TId        string `json:"to_id"`
	Point      int    `json:"point"`
	Message    string `json:"message"`
	PostedTime string `json:"posted_time"`
}
type SubmitMessage struct {
	FId     string `json:"from_id"`
	TId     string `json:"to_id"`
	Point   int    `json:"point"`
	Message string `json:"message"`
}

type EditMessage struct {
	Id      string `json:"id"`
	Point   int    `json:"point"`
	Message string `json:"message"`
}

type EditName struct {
	Id      string `json:"id"`
	NewName string `json:"new_name"`
}
