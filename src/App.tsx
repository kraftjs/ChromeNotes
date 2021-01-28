import * as React from 'react';
import './App.css';

import Form from './components/Form';
import Heading from './components/Heading';

const App = () => {
  return (
    <React.Fragment>
      <Heading />
      <Form focus={false} />
    </React.Fragment>
  );
};

export default App;
