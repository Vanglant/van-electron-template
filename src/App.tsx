import { hot } from 'react-hot-loader/root';
import * as React from 'react';

const App = () => (
  <div>
    <h1>Hello, world.</h1>
  </div>
);

(async () => {
  console.log(
    'You have async support if you read this instead of "ReferenceError: regeneratorRuntime is not defined" error.'
  );
})();

export default App;
