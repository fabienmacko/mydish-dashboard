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
import axios from 'axios';

import {FETCH_DISHS_QUERY} from '../../utils/graphql';
import toBase64 from '../../utils/tobase64';
import Loader from '../Loader';
import './createnewdish.scss';

const CreateNewDish = ({foods}) => {

  const CreateDishSwal = withReactContent(Swal);

  async function convertImageToBase64(file) {
    const base64EncodedImage = await toBase64(file);
    setImageInputBase64Encoded(base64EncodedImage);
  }

  const [shouldLoaderAppear, setShouldLoaderAppear] = useState(false);

  // Form values
  const [nameInputValue, setNameInputValue] = useState();
  const [foodInputValue, setFoodInputValue] = useState(foods[0].id);
  const [priceInputValue, setPriceInputValue] = useState();
  const [centsInputValue, setCentsInputValue] = useState('00');
  const [ingredientsInputValue, setIngredientsInputValue] = useState('');
  const [preparationTimeInputValue, setPreparationTimeInputValue] = useState();
  const [imageInputBase64Encoded, setImageInputBase64Encoded] = useState();
  const [imageFile, setImageFile] = useState({});
  console.log(nameInputValue);

  const serverBaseUrl = process.env.REACT_APP_SERVER_URL;

  const [createDish] = useMutation(CREATE_DISH_MUTATION, {
    variables: {
      name: nameInputValue,
      food: foodInputValue,
      price: parseInt(priceInputValue + centsInputValue),
      ingredients: ingredientsInputValue.split(',').map(ingredient => ingredient.trim()),
      preparationTime: +preparationTimeInputValue,
      imagePath: serverBaseUrl+'/images/'+imageFile.name
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

  const fileUpload = () => {
    const url = serverBaseUrl+'/image';
    const formData = new FormData();
    console.log('ImageFile', imageFile);
    formData.append('file', imageFile);
    formData.append('name', imageFile.name);
    formData.append('desc','Test description');

    return axios.post(url, formData);
  }

  const submitForm = () => {
    fileUpload().then((response)=>{
      console.log(response.data);
    })
    setShouldLoaderAppear(true);
    createDish();
    resetForm();
  }

  const isFormValid = () => {

    let isFormValid = true;

    if (!nameInputValue) {
      console.log("FAILED NAME : "+ nameInputValue);
      isFormValid = false;
    }

    return isFormValid;
  }

  const resetForm = () => {
     setNameInputValue('');
     setFoodInputValue(foods[0].id);
     setPriceInputValue(0);
     setCentsInputValue(0);
     setIngredientsInputValue('');
     setPreparationTimeInputValue(0);
     setImageInputBase64Encoded('');
  }

  const handleImageFileChange = (e) => {
    setImageFile(e.target.files[0]);
  }

  const handlePriceChange = (e) => {
    const priceValue = e.target.value;
    
    setPriceInputValue(priceValue);
  }

  const handleCentsChange = (e) => {
    const centsValue = e.target.value;

    setCentsInputValue(centsValue);
  }

  const handlePriceInput = (e) => {
    const inputMaxLength = e.target.maxLength;
    const inputValueLength = e.target.value.length;
    const priceCentsInputElement = document.getElementById('price-cents');

    if (inputValueLength === inputMaxLength) {
      priceCentsInputElement.focus();
      priceCentsInputElement.select();
    }
  };

  const allowOnlyNumbers = (e) => {
    const isNumber = e.charCode >= 48 && e.charCode <= 57;

    if (!isNumber) {
      e.preventDefault();
    }
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
              <Input type="text" name="name" id="name" placeholder="Calzone" value={nameInputValue} onChange={e => setNameInputValue(e.target.value)} />
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
              <Label for="ingredients">Ingredients (Comma separated)</Label>
              <Input type="text" name="ingredients" id="ingredients" placeholder="Sauce tomate, Fromage, Jambon" onChange={e => setIngredientsInputValue(e.target.value)} />
            </FormGroup>

            <FormGroup>
              <Label for="preparationTime">Preparation Time</Label>
              <div className="input-container">
                <input type="text" placeholder="50" maxLength="2" name="preparationTime" id="preparationTime" className="numberInput" onChange={e => setPreparationTimeInputValue(e.target.value)} onKeyPress={allowOnlyNumbers} />
                <div className="currency">mins</div>
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="price">Price</Label>
              <div className="input-container">
                <input type="text" placeholder="13" maxLength="2" name="price" id="price" className="numberInput" onChange={handlePriceChange} onInput={handlePriceInput} onKeyPress={allowOnlyNumbers} />
                <div className="price-comma">,</div>
                <input type="text" placeholder="50" maxLength="2" name="price-cents" id="price-cents" defaultValue="00" className="numberInput" onChange={handleCentsChange} onKeyPress={allowOnlyNumbers} />
                <div className="currency">€</div>
              </div>
            </FormGroup>

            <FormGroup>
              <Label for="image">Image</Label>
              <Input type="hidden" id="image" name="image" />
              <CustomInput type="file" id="imageFile" name="imageFile" label="Pick an image" className="form-control" onChange={handleImageFileChange}  />
            </FormGroup>

          </Form>
          </ApolloProvider>,
          showConfirmButton: true,
          confirmButtonText: 'Submit'
        }).then(result => {
          if (result.isConfirmed /* isFormValid() */) {
            console.log('form submited');
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