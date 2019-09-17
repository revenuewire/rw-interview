import React from 'react';
import { Route } from 'react-router-dom';

import CarList from './cars/CarListContainer';

const App = () => (
  <div>
    <Route exact path="/" component={CarList} />
  </div>
);

export default App;
