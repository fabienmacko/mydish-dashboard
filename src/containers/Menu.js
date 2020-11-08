import { connect } from 'react-redux';

import Menu from '../views/Menu';
import {updateFoods} from '../store/reducer';

const mapStateToProps = state => ({
  foods: state.foods,
});

const mapDispatchToProps = dispatch => ({
  updateFoods: foods => {
    dispatch(updateFoods(foods))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Menu);