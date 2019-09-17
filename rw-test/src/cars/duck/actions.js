import axios from 'axios';
import types from './types';

const ROOT_URL = 'http://localhost:8080';

const fetchCars = () => {
  let url = `${ROOT_URL}/cars`;
  const request = axios({
    method: 'get',
    url,
    headers: []
  });
  return {
    type: types.FETCH_CARS,
    payload: request
  };
};

const fetchCarsSuccess = cars => ({
  type: types.FETCH_CARS_SUCCESS,
  payload: cars,
});

const fetchCarsFailure = error => ({
  type: types.FETCH_CARS_FAILURE,
  payload: error
});

const fetchCar = (id) => {
  let url = `${ROOT_URL}/car/${id}`;
  const request = axios({
    method: 'get',
    url,
    headers: []
  });
  return {
    type: types.FETCH_CAR,
    payload: request
  };
};

const fetchCarSuccess = car => ({
  type: types.FETCH_CAR_SUCCESS,
  payload: car,
});

const fetchCarFailure = error => ({
  type: types.FETCH_CAR_FAILURE,
  payload: error
});

const postCars = data => {
  const request = axios({
    method: 'post',
    url: `${ROOT_URL}/car`,
    data
  });
  return {
    type: types.POST_CARS,
    payload: request
  };
};

const postCarsSuccess = (res, carId) => ({
  type: types.POST_CARS_SUCCESS,
  payload: res,
  carId
});

const postCarsFailure = error => ({
  type: types.POST_CARS_FAILURE,
  payload: error
});

const updateCars = (data, link) => {
  const request = axios({
    method: 'put',
    url: `${ROOT_URL}/car/?link=${link}`,
    data
  });
  return {
    type: types.UPDATE_CARS,
    payload: request
  };
};

const updateCarsSuccess = (res, carId) => ({
  type: types.UPDATE_CARS_SUCCESS,
  payload: res,
  carId
});

const updateCarsFailure = error => ({
  type: types.UPDATE_CARS_FAILURE,
  payload: error
});

const deleteCars = link => {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/car/?link=${link}`,
  });
  return {
    type: types.DELETE_CARS,
    payload: request
  };
};

const deleteCarsSuccess = (res, carId) => ({
  type: types.DELETE_CARS_SUCCESS,
  payload: res,
  deletedCarId: carId
});

const deleteCarsFailure = error => ({
  type: types.DELETE_CARS_FAILURE,
  payload: error
});

export { ROOT_URL, fetchCars, fetchCarsSuccess, fetchCarsFailure, fetchCar, fetchCarFailure, fetchCarSuccess,
  postCars, postCarsSuccess, postCarsFailure, updateCars, updateCarsFailure, updateCarsSuccess, deleteCars,
  deleteCarsFailure, deleteCarsSuccess };
