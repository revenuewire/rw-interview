import { connect } from 'react-redux';
import CarList from './CarListComponent';
import { carOperations } from './duck';

const mapDispatchToProps = dispatch => {
  const getCarList = () => {
    dispatch(carOperations.getCarList());
  };

  const getCar = (id) => {
    dispatch(carOperations.getCar(id));
  };

  const doPostCars = data => {
    dispatch(carOperations.doPostCars(data));
  };

  const doUpdateCars = (data, link) => {
    dispatch(carOperations.doUpdateCars(data, link));
  };

  const doDeleteCars = (carId, link) => {
    dispatch(carOperations.doDeleteCars(carId, link));
  };

  return {
    getCarList,
    getCar,
    doPostCars,
    doUpdateCars,
    doDeleteCars
  };
};

const mapStateToProps = state => ({
  carList: state.cars.carList,
  car: state.cars.car,
  webLinks: state.cars.webLinks,
});
const CarListContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CarList);

export default CarListContainer;
