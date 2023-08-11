import { Provider } from 'react-redux';
import { store } from './src/store';
import Application from './src/App';

const App = () => {
  return (
    <Provider store={store}>
      <Application />
    </Provider>
  );
};

export default App;
