import Main from './_pages/Main'
import Favourites from './_pages/Favourites'
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();
function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: 'aliceblue' },
            tabBarLabelStyle: { color: 'black', fontSize: 15 },
            orientation: 'landscape'
          }}>
          <Tab.Screen name="Home" component={Main} />
          <Tab.Screen name="Favourıtes" component={Favourites} />
        </Tab.Navigator>
      </NavigationContainer >
    </SafeAreaProvider >
  )
}
export default App