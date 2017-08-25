package router

import (
	"../handlers"
	"../types"
)

var TradeRoutes = types.Routes{
	types.Route{
		"RequestTrade",
		"POST",
		"/trade/request",
		handlers.RequestTradeHandler,
	},
	types.Route{
		"ShowMyRequests",
		"GET",
		"/trade/my",
		handlers.MyRequestsHandler,
	},
	types.Route{
		"ShowReceivedRequests",
		"GET",
		"/trade/received",
		handlers.ReceivedRequestsHandler,
	},
	types.Route{
		"RemoveTradeRequest",
		"DELETE",
		"/trade/request",
		handlers.RemoveTradeRequestHandler,
	},
	types.Route{
		"RemoveTradeRequestsInBulk",
		"DELETE",
		"/trade/requests/{type}/{status}",
		handlers.RemoveRequestsBulkHandler,
	},
	types.Route{
		"TradeRequestAction",
		"PATCH",
		"/trade/request",
		handlers.TradeRequestActionHandler,
	},
}
