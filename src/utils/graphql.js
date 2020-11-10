import {gql} from '@apollo/client';

export const FETCH_FOODS_QUERY = gql`
query {
  foods{
    category
    imagePath
    id
    dishs{
      name
      price
    }
  }
}
`;

export const FETCH_DISHS_QUERY = gql`
query {
  dishs{
    id
    name
    food{
      id
      category
    }
    price
    ingredients
    imagePath
    preparationTime
  }
}
`;