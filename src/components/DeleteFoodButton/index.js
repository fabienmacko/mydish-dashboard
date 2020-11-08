import React from 'react';
import {useMutation, gql} from '@apollo/client';
import {FETCH_FOODS_QUERY} from '../../utils/graphql';

const DeleteFoodButton = ({foodToDeleteId}) => {


  const [deleteFood] = useMutation(DELETE_FOOD_MUTATION, {
    update(cache) {
      console.log("DELETED DISH",foodToDeleteId);

      const data = cache.readQuery({
        query: FETCH_FOODS_QUERY
      });

      console.log(data);
      const newData = data.foods.filter(food => food.id != foodToDeleteId);

      cache.writeQuery({ query: FETCH_FOODS_QUERY, data: {
        foods: [...newData]
      }})
      
    },
  });
      

  return (
    <i onClick={() => deleteFood({
      variables: {
        foodId: foodToDeleteId
      }
    })} className="far fa-trash-alt fa-2x" style={{color: 'red',cursor: 'pointer'}}></i>
  )
}

const DELETE_FOOD_MUTATION = gql`
  mutation DeleteFood($foodId: String!) {
    deleteFood(foodId: $foodId)
  }
`

export default DeleteFoodButton;