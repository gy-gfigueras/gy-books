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
          bio
        }
      }
      book_series {
        series {
          id
          name
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
    dto_combined
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
