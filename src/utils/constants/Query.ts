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
