export const SEARCH_BOOKS_QUERY = `
  query SearchBooks($query: String!) {
    search(query: $query) {
      error
      page
      per_page
      query
      query_type
      results
    }
  }
`;

export const GET_BOOK_BY_ID_QUERY = `
  query GetBookById($id: Int!) {
    books_by_pk(id: $id) {
      id
      title
      description
      release_date
      image {
        url
      }
      contributions(limit: 1) {
        author {
          id
          name
          image {
            url
          }
        }
      }
      book_series {
        id
        series {
          id
          name
        }
        book {
          release_date
          editions {
            id
            book_id
            cached_image
            language {
              language
              id
            }
            pages
            title
          }
        }
      }
    }
  }
`;

export const GET_BOOKS_BY_IDS_QUERY = `
  query GetBooksByIds($ids: [Int!]!) {
    books(where: {id: {_in: $ids}}) {
      id
      title
      description
      release_date
      image {
        url
      }
      contributions(limit: 1) {
        author {
          id
          name
          image {
            url
          }
        }
      }
      book_series {
        id
        series {
          id
          name
        }
        book {
          release_date
          editions {
            id
            book_id
            cached_image
            language {
              language
              id
            }
            pages
            title
          }
        }
      }
    }
  }
`;

export const GET_SPANISH_BOOK_BY_ID_QUERY = `
query GetSpanishEditionByBookId {
  editions(where: {book_id: {_eq: 386446}, language_id: {_eq: 148}}, limit: 1) {
    id
    pages
    image {
      id
    }
    contributions(limit: 1) {
      author {
        id
        name
        image {
          url
        }
      }
    }
    title
  }
}
`;

export const GET_STATS = `
 query GetBookStats($id: Int!) {
    books_by_pk(id: $id) {
    id
    title
    pages
    contributions{
      author {
        id
        name
        image {
          url
        }
      }
    }
  }
}

`;

export const GET_MULTIPLE_STATS = `
 query GetMultipleBookStats($ids: [Int!]!) {
    books(where: {id: {_in: $ids}}) {
    id
    title
    pages
    contributions{
      author {
        id
        name
        image {
          url
        }
      }
    }
  }
}

`;

export const SEARCH_AUTHORS_QUERY = `
  query SearchAuthors($query: String!) {
    search(query: $query, query_type: "author", per_page: 10) {
      error
      page
      per_page
      query
      query_type
      results
    }
  }
`;

export const GET_AUTHOR_BY_ID_QUERY = `
  query GetAuthorById($id: Int!) {
    authors(where: { id: { _eq: $id } }, limit: 1) {
      id
      name
      bio
      born_year
      born_date
      books_count
      image {
        url
      }
      contributions(where: { contributable_type: { _eq: "Book" } }, limit: 3000) {
        book {
          id
          title
          description
          release_year
          book_series {
            series {
              id
              name
            }
          }
          image {
            url
          }
        }
      }
    }
  }
`;
