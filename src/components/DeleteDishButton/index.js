import React from 'react';
import {useMutation, gql} from '@apollo/client';
import {FETCH_DISHS_QUERY} from '../../utils/graphql';

const DeleteDishButton = ({dishToDeleteId}) => {


  const [deleteDish] = useMutation(DELETE_DISH_MUTATION, {
    update(cache) {
      console.log("DELETED DISH",dishToDeleteId);

      const data = cache.readQuery({
        query: FETCH_DISHS_QUERY
      });
      
      console.log(data);
      const newData = data.dishs.filter(dish => dish.id != dishToDeleteId);

      cache.writeQuery({ query: FETCH_DISHS_QUERY, data: {
        dishs: [...newData]
      }})
      
    },
  });
      

  return (
    <i onClick={() => deleteDish({
      variables: {
        dishId: dishToDeleteId
      }
    })} className="far fa-trash-alt fa-2x" style={{color: 'red',cursor: 'pointer'}}></i>
  )
}

const DELETE_DISH_MUTATION = gql`
  mutation DeleteDish($dishId: String!) {
    deleteDish(dishId: $dishId)
  }
`

export default DeleteDishButton;