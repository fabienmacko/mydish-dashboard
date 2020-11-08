import React, {useState} from 'react';
import {useMutation, gql} from '@apollo/client';
import {FETCH_FOODS_QUERY} from '../../utils/graphql';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Loader from '../Loader';

const DeleteFoodButton = ({foodToDeleteId, foodToDeleteName}) => {

  const [shouldLoaderAppear, setShouldLoaderAppear] = useState(false);

  const ConfirmDeleteFoodSwal = withReactContent(Swal);

  const [deleteFood] = useMutation(DELETE_FOOD_MUTATION, {
    update(cache) {
      const data = cache.readQuery({
        query: FETCH_FOODS_QUERY
      });

      console.log(data);
      const newData = data.foods.filter(food => food.id != foodToDeleteId);

      cache.writeQuery({ query: FETCH_FOODS_QUERY, data: {
        foods: [...newData]
      }});

      // Remove the loader once the mutation has been done
      setShouldLoaderAppear(false);
    },
  });
      

  return (
    <>
      <i onClick={() => {

        // Fire swal, if the user confirm, then delete the food category and all the associated dishs
        ConfirmDeleteFoodSwal.fire({
          title: <strong>Do you really want to delete the food category {foodToDeleteName} ?</strong>,
          html: <p>Please note that deleting this food category will also delete all the dishs that have {foodToDeleteName} as food type.</p>,
          showConfirmButton: true,
          showCancelButton: true,
        }).then(result => {
          if (result.isConfirmed) {
            
            // Show loader when the user confirm, waiting for the end of the mutation to remove it
            setShouldLoaderAppear(true);

            deleteFood({
              variables: {
                foodId: foodToDeleteId
              }
            })
          }
        })
      }} className="far fa-trash-alt fa-2x" style={{color: 'red',cursor: 'pointer'}}></i>
      <Loader shouldAppear={shouldLoaderAppear} />
    </>
  )
}

const DELETE_FOOD_MUTATION = gql`
  mutation DeleteFood($foodId: String!) {
    deleteFood(foodId: $foodId)
  }
`

export default DeleteFoodButton;