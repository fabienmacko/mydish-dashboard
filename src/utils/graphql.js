import {gql} from '@apollo/client';

export const FETCH_SETTINGS_QUERY = gql`
query {
  settings{
    id
    openHours {
      monday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
      tuesday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
      wednesday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
      thursday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
      friday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
      saturday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
      sunday {
        midday{
          open
          close
        }
        evening{
          open
          close
        }
      }
    }
  }
}
`;

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