import React, {useState} from 'react';
import {gql, useMutation} from '@apollo/client';
import {
  Button,
  FormGroup,
  Form,
  Input,
  Label,
  CustomInput
} from "reactstrap";
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ApolloProvider } from '@apollo/client';
import client from '../../apolloProvider';

import {FETCH_DISHS_QUERY} from '../../utils/graphql';
import toBase64 from '../../utils/tobase64';
import Loader from '../Loader';

const CreateNewDish = ({foods}) => {

  const CreateDishSwal = withReactContent(Swal);

  async function convertImageToBase64(file) {
    const base64EncodedImage = await toBase64(file);
    setimageInputBase64Encoded(base64EncodedImage);
  }

  const [shouldLoaderAppear, setShouldLoaderAppear] = useState(false);

  // Form values
  const [nameInputValue, setNameInputValue] = useState('');
  const [foodInputValue, setFoodInputValue] = useState(foods[0].id);
  const [priceInputValue, setPriceInputValue] = useState(0);
  const [ingredientsInputValue, setIngredientsInputValue] = useState('');
  const [preparationTimeInputValue, setPreparationTimeInputValue] = useState(0);
  const [imageInputBase64Encoded, setimageInputBase64Encoded] = useState('');
  

  const [createDish] = useMutation(CREATE_DISH_MUTATION, {
    variables: {
      name: nameInputValue,
      food: foodInputValue,
      price: +priceInputValue,
      ingredients: ingredientsInputValue.split(',').map(ingredient => ingredient.trim()),
      preparationTime: +preparationTimeInputValue,
      imagePath: imageInputBase64Encoded
    },
    update(cache,result) {
      console.log(cache.data.data.ROOT_QUERY);
      if(!cache.data.data.ROOT_QUERY){
        throw console.error('No root query');
      } else { 
        const data = cache.readQuery({
          query: FETCH_DISHS_QUERY
        });

        console.log(data.dishs);

        const newDishsData = data.dishs ? [...data.dishs, result.data.createDish] : [result.data.createDish];

        cache.writeQuery({query: FETCH_DISHS_QUERY, data: {
          dishs: newDishsData
        }});
      }

      setShouldLoaderAppear(false);
    }
  })

  const submitForm = () => {
    setShouldLoaderAppear(true);
    createDish();
    resetForm();
  }

  const resetForm = () => {
     setNameInputValue('');
     setFoodInputValue(foods[0].id);
     setPriceInputValue(0);
     setIngredientsInputValue('');
     setPreparationTimeInputValue(0);
     setimageInputBase64Encoded('');
  }

  return (
    <>
      {shouldLoaderAppear && <Loader />}
      <Button onClick={() => {

        CreateDishSwal.fire({
          title: <strong>Create a new Dish</strong>,
          html:  <ApolloProvider client={client}>
          <Form>

            <FormGroup>
              <Label for="name">Name</Label>
              <Input style={{
                color: "black"
              }} type="text" name="name" id="name" placeholder="Calzone" onChange={e => setNameInputValue(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="food">Food type</Label>
              <Input style={{color:'black'}} type="select" name="food" id="food" onChange={e => setFoodInputValue(e.target.value)}>
                {
                  foods && foods.map((food, index) => index === 0 ? <option defaultValue key={food.id} value={food.id}>{food.category}</option> : <option key={food.id} value={food.id}>{food.category}</option>)
                }
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="price">Price</Label>
              <Input style={{
                color: "black"
              }} type="number" name="price" id="price" onChange={e => setPriceInputValue(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="ingredients">Ingredients (Comma separated)</Label>
              <Input style={{
                color: "black"
              }} type="text" name="ingredients" id="ingredients" placeholder="Sauce tomate, Fromage, Jambon" onChange={e => setIngredientsInputValue(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="preparationTime">Preparation Time</Label>
              <Input style={{
                color: "black"
              }} type="number" name="preparationTime" id="preparationTime" onChange={e => setPreparationTimeInputValue(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="image">Image</Label>
              <Input style={{
                color: "black"
              }} type="hidden" id="image" name="image" />
              <CustomInput style={{
                color: "black !important"
              }} type="file" id="imageFile" name="imageFile" label="Pick an image" onChange={e => convertImageToBase64(e.target.files[0])}  />
            </FormGroup>

          </Form>
          </ApolloProvider>,
          showConfirmButton: true,
          confirmButtonText: 'Submit'
        }).then(result => {
          if (result.isConfirmed) {
            submitForm();
          }
        })

      }} color="success">Create new Dish</Button> 
    </>   
  );
}

const CREATE_DISH_MUTATION = gql`
mutation createDish(
  $name: String!,
  $food: String!,
  $price: Int!,
  $ingredients: [String!]!,
  $imagePath: String!,
  $preparationTime: Int!
  ) {
  createDish(dishInput: {
    name: $name,
    food: $food,
    price: $price,
    ingredients: $ingredients,
    imagePath: $imagePath,
    preparationTime: $preparationTime,
  }){
    name
  }
}
`

export default CreateNewDish;