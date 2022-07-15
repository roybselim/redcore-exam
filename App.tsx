// In App.js in a new project

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Books from './src/Books';
import Content from './src/Content';

export type RootStackParamList = {
  Books: undefined;
  Content: { title: string };
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Books">
        <Stack.Screen name="Books" component={Books} />
        <Stack.Screen 
          name="Content" 
          component={Content} 
          options={({route: {params}}) => ({
            headerTitle: params.title.split('/')[1].split('.')[0]
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;