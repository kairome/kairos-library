export type TradeBook = {
  id: string,
  title: string,
  authors: string,
  image: string,
  owner: string,
  applicant: string,
  due: string,
};

export type RequestsType = {
  pending: Array<TradeBook>,
  approved: Array<TradeBook>,
  denied: Array<TradeBook>,
  expired: Array<TradeBook>,
};

export type RemoveRequest = {
  bookId: string,
  applicant: string,
  type: 'my' | 'received',
  owner: string,
};

export type RequestAction = {
  bookId: string,
  applicant: string,
  type: 'approve' | 'deny',
};
