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

import {FETCH_FOODS_QUERY} from '../../utils/graphql';
import toBase64 from '../../utils/tobase64';
import Loader from '../Loader';
import './createnewfood.scss';

const CreateNewFood = () => {

  const CreateFoodSwal = withReactContent(Swal);

  async function convertImageToBase64(file) {
    const base64EncodedImage = await toBase64(file);
    setimageInputBase64Encoded(base64EncodedImage);
  }
  
  const [shouldLoaderAppear, setShouldLoaderAppear] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState('');
  const [imageInputBase64Encoded, setimageInputBase64Encoded] = useState('');

  const [createFood] = useMutation(CREATE_FOOD_MUTATION, {
    variables: {
      category: categoryInputValue,
      imagePath: imageInputBase64Encoded
    },
    update(cache,result) {
      const data = cache.readQuery({
        query: FETCH_FOODS_QUERY
      });

      cache.writeQuery({query: FETCH_FOODS_QUERY, data: {
        foods: [...data.foods, result.data.createFood]
      }});
    },
    onCompleted() {
      setShouldLoaderAppear(false);
    }
  })

  const submitForm = () => {
    setShouldLoaderAppear(true);
    createFood();
    resetForm();
  }

  const resetForm = () => {
    setCategoryInputValue('');
    setimageInputBase64Encoded('');
  }

  return (
    <>
      {shouldLoaderAppear && <Loader />}
      <Button onClick={() => {

        CreateFoodSwal.fire({
          title: <strong>Create a new food category</strong>,
          html:  <ApolloProvider client={client}>
          <Form>

            <FormGroup>
              <Label for="category">Category</Label>
              <Input style={{
                color: "black"
              }} type="text" name="category" id="category" placeholder="Pizza, Pasta, Hamburger.." onChange={e => setCategoryInputValue(e.target.value)} />
            </FormGroup>
            <FormGroup>
              <Label for="image" style={{
                color: "black"
              }}>Image</Label>
              <Input style={{
                color: "black"
              }} type="hidden" id="image" name="image" value={imageInputBase64Encoded} />
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

      }} color="success">Create new food category</Button> 
    </>   
  );
}

const CREATE_FOOD_MUTATION = gql`
mutation createFood($category: String!, $imagePath: String!) {
  createFood(foodInput: {
    category: $category,
    imagePath: $imagePath
  }){
    category,
    imagePath
  }
}
`

export default CreateNewFood;