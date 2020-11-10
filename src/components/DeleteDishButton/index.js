import React, {useState} from 'react';
import {useMutation, gql} from '@apollo/client';
import {FETCH_DISHS_QUERY} from '../../utils/graphql';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Loader from '../Loader';

const DeleteDishButton = ({dishToDeleteId, dishToDeleteName}) => {

  const [shouldLoaderAppear, setShouldLoaderAppear] = useState(false);

  const ConfirmDeleteDishSwal = withReactContent(Swal);

  const [deleteDish] = useMutation(DELETE_DISH_MUTATION, {
    update(cache) {

      const data = cache.readQuery({
        query: FETCH_DISHS_QUERY
      });
      
      const newData = data.dishs.filter(dish => dish.id != dishToDeleteId);

      cache.writeQuery({ query: FETCH_DISHS_QUERY, data: {
        dishs: [...newData]
      }});
      
      setShouldLoaderAppear(false);
    }
  });
      

  return (
    <>
      <i onClick={() => {

        setShouldLoaderAppear(true);
        
        deleteDish({
          variables: {
            dishId: dishToDeleteId
          }
        })
      }} className="far fa-trash-alt fa-2x" style={{color: 'red',cursor: 'pointer'}}></i>
      <Loader shouldAppear={shouldLoaderAppear} />
    </>
  )
}

const DELETE_DISH_MUTATION = gql`
  mutation DeleteDish($dishId: String!) {
    deleteDish(dishId: $dishId) {
      id
      name
      price
    }
  }
`

export default DeleteDishButton;