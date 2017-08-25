export type Book = {
  id: string,
  title: string,
  authors: string,
  description: string,
  categories: string,
  publishedDate: string,
  image: string,
  infoLink: string,
  owner: string,
};

export type LoanedBook = BookType & {
  due: string,
};
