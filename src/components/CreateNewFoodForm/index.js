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

import {FETCH_FOODS_QUERY} from '../../utils/graphql';
import toBase64 from '../../utils/tobase64';

const CreateNewFoodForm = () => {

  async function convertImageToBase64(file) {
    const base64EncodedImage = await toBase64(file);
    setimageInputBase64Encoded(base64EncodedImage);
  }

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
    }
  })

  const submitForm = event => {
    event.preventDefault();

    createFood();
  }

  return (
    <Form onSubmit={event => submitForm(event)}>
      <FormGroup>
        <Label for="category">Category</Label>
        <Input style={{
          color: "black"
        }} type="text" name="category" id="category" placeholder="Pizza, Pasta, Hamburger.." value={categoryInputValue} onChange={e => setCategoryInputValue(e.target.value)} />
      </FormGroup>
      <FormGroup>
        <Label for="image">Image</Label>
        <Input style={{
          color: "black"
        }} type="hidden" id="image" name="image" value={imageInputBase64Encoded} />
        <CustomInput style={{
          color: "black !important"
        }} type="file" id="imageFile" name="imageFile" label="Pick an image" onChange={e => convertImageToBase64(e.target.files[0])}  />
      </FormGroup>

      <Button>Submit</Button>
    </Form>
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

export default CreateNewFoodForm;