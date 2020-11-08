/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import { useQuery, ApolloProvider } from '@apollo/client';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
} from "reactstrap";

import client from '../apolloProvider';
import DeleteDishButton from '../components/DeleteDishButton';
import DeleteFoodButton from '../components/DeleteFoodButton';
import CreateNewFoodForm from '../components/CreateNewFoodForm';
import {FETCH_FOODS_QUERY, FETCH_DISHS_QUERY} from '../utils/graphql';

const CreateFoodSwal = withReactContent(Swal);

const Menu = () => {

  console.log(client);

  const { loading: foodLoading, error: foodError, data: foodsData } = useQuery(FETCH_FOODS_QUERY);

  const { loading: dishLoading, error: dishError, data: dishsData } = useQuery(FETCH_DISHS_QUERY);

  return (
    <>
      <div className="content">
  
      <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Foods Categories</CardTitle>
                <Button onClick={() => {

                  CreateFoodSwal.fire({
                    title: <strong>Create a new food category</strong>,
                    html:  <ApolloProvider client={client}>
                    <CreateNewFoodForm />
                    </ApolloProvider>,
                    showConfirmButton: false
                  })

                }} color="success">Create new food category</Button>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Category</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      foodsData && foodsData.foods.map(({category, imagePath, id}) => (
                        <tr key={id}>
                          <td>{category}</td>
                          <td><div style={{
                            position: "relative",
                            borderRadius: "5px",
                            height: "200px",
                            overflow: 'hidden',
                            maxWidth: "900px",
                            display: 'flex',
                            justifyContent: "flex-end",
                            alignItems: 'center'
                          }}>
                            <img src={imagePath} alt=""/>
                          </div></td>
                          <td><DeleteFoodButton foodToDeleteId={id} /></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Dishs</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Food type</th>
                      <th>Price</th>
                      <th>Ingredients</th>
                      <th>Image</th>
                      <th>Preparation Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      dishsData && dishsData.dishs.map(({id, name, food, price, ingredients, imagePath, preparationTime}) => (
                        <tr key={id}>
                          <td>{name}</td>
                          <td>{food.category}</td>
                          <td>{price}€</td>
                          <td>
                            <ul>
                              {ingredients.map((ingredient,index) => <li key={`ingredient${index}`}>{ingredient}</li>)}
                            </ul>
                          </td>
                          <td><div style={{
                            position: "relative",
                            borderRadius: "5px",
                            height: "200px",
                            overflow: 'hidden',
                            maxWidth: "900px",
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            <img src={imagePath} alt=""/>
                          </div></td>
                          <td>{preparationTime} minuts</td>
                          <td><DeleteDishButton dishToDeleteId={id} /></td>
                        </tr>
                      ))
                    }
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
          
      
        </Row>
      </div>
    </>
  );
}

export default Menu;
