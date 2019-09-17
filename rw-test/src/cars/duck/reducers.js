import types from './types';

const INITIAL_STATE = {
  carList: { cars: [], error: null, loading: false, commiting: false, commited: false, deletedCarId: -1 },
  car: { res: {}, error: null, loading: false },
  webLinks: []
};

const carReducer = (state = INITIAL_STATE, action) => {
  let error;
  //let webLink = [];
  switch (action.type) {
    case types.FETCH_CARS:
      return { ...state, carList: { cars: state.carList.cars, error: null, loading: true } };
    case types.FETCH_CARS_SUCCESS:
      return { ...state, carList: { cars: action.payload, error: null, loading: false } };
    case types.FETCH_CARS_FAILURE:
      error = { message: action.payload.data.errors ? action.payload.data.errors : null, status: action.payload.status };
      return { ...state, carList: { cars: [], error, loading: false } };
    case types.RESET_CARS:
      return { ...state, carList: { cars: [], error: null, loading: false } };

    case types.FETCH_CAR:
      return { ...state, car: { res: state.car.res, error: null, loading: true }, carList: { ...state.carList, commited: false } };
    case types.FETCH_CAR_SUCCESS:
      return { ...state, car: { res: action.payload, error: null, loading: false } };
    case types.FETCH_CAR_FAILURE:
      error = { message: action.payload.data.errors ? action.payload.data.errors : null, status: action.payload.status };
      return { ...state, car: { res: {}, error, loading: false } };

    case types.POST_CARS:
      return { ...state, carList: { ...state.carList, commiting: true, commited: false } };
    case types.POST_CARS_SUCCESS:
      return { ...state, carList: { ...state.carList, commiting: false, commited: true }, webLinks: [...state.webLinks, { carId: action.carId, ok: true, url: action.payload }] };
    case types.POST_CARS_FAILURE:
      error = { message: action.payload.data.errors ? action.payload.data.errors : null };
      return { ...state, carList: { ...state.carList, error, commiting: false, commited: false }, webLinks: [...state.webLinks, { carId: action.carId, ok: false, url: '' }] };

    case types.UPDATE_CARS:
      return { ...state, carList: { ...state.carList, commiting: true, commited: false} };
    case types.UPDATE_CARS_SUCCESS:
      return { ...state, carList: { ...state.carList, commiting: false, commited: true } };
    case types.UPDATE_CARS_FAILURE:
      error = { message: action.payload.data.errors ? action.payload.data.errors : null };
      return { ...state, carList: { ...state.carList, error, commiting: false, commited: false } };

    case types.DELETE_CARS:
      return { ...state, carList: { ...state.carList, commiting: true, commited: false } };
    case types.DELETE_CARS_SUCCESS:
      //state.webLinks.map()
      return { ...state, carList: { ...state.carList, commiting: false, commited: true }, webLinks: state.webLinks.filter(link => link.carId !== action.deletedCarId) };
    case types.DELETE_CARS_FAILURE:
      error = { message: action.payload.data.errors ? action.payload.data.errors : null };
      return { ...state, carList: { ...state.carList, error, commiting: false, commited: false } };

    default:
      return state;
  }
};

export default carReducer;
