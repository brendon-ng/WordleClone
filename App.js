import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import GameScreen from './src/screens/GameScreen';
import { Provider } from 'react-redux';
import { store } from './src/store';

const navigator = createStackNavigator(
  {
    Game: GameScreen,
  },
  {
    initialRouteName: 'Game',
    defaultNavigationOptions: {
      title: 'WORDLE',
      headerShown: false,
    },
  }
);

const AppContainer = createAppContainer(navigator);

const App = () => {
  return (
    <Provider store={store}>
      <AppContainer />
    </Provider>
  );
};

export default App;
