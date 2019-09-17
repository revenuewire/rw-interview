import { fetchCars, fetchCarsFailure, fetchCarsSuccess, fetchCar, fetchCarFailure, fetchCarSuccess,
   postCars, postCarsFailure, postCarsSuccess, updateCars, updateCarsFailure, updateCarsSuccess,
   deleteCars, deleteCarsFailure, deleteCarsSuccess } from './actions';

const getCarList = () => dispatch => {
  const response = dispatch(fetchCars());
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        dispatch(fetchCarsSuccess(result.data));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(fetchCarsFailure(error.response));
      }
    });
};

const getCar = (id) => dispatch => {
  const response = dispatch(fetchCar(id));
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        dispatch(fetchCarSuccess(result.data));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(fetchCarFailure(error.response));
      }
    });
};

const doPostCars = (data) => dispatch => {
  const response = dispatch(postCars(data));
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        dispatch(postCarsSuccess(result.data, data.id));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(postCarsFailure(error.response));
      }
    });
};

const doUpdateCars = (data, link) => dispatch => {
  const response = dispatch(updateCars(data, link));
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        dispatch(updateCarsSuccess(result.data, data.id));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(updateCarsFailure(error.response));
      }
    });
};

const doDeleteCars = (carId, link) => dispatch => {
  const response = dispatch(deleteCars(link));
  response.payload
    .then(result => {
      if (result && result.status === 200 && !result.data.errors) {
        dispatch(deleteCarsSuccess(result.data, carId));
      }
    })
    .catch(error => {
      if (error.response) {
        dispatch(deleteCarsFailure(error.response));
      }
    });
};

export default {
  getCarList,
  getCar,
  doPostCars,
  doUpdateCars,
  doDeleteCars
};
