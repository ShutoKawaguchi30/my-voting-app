import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InputScreen from './screens/InputScreen';
import SelectPoliciesScreen from './screens/SelectPoliciesScreen';
import VoteScreen from './screens/VoteScreen';
import ResultScreen from './screens/ResultScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Input">
        <Stack.Screen name="Input" component={InputScreen} options={{ title: 'プロフィール入力' }} />
        <Stack.Screen name="SelectPolicies" component={SelectPoliciesScreen} options={{ title: '政策を選ぶ' }} />
        <Stack.Screen name="Vote" component={VoteScreen} options={{ title: '政策に投票' }} />
        <Stack.Screen name="Result" component={ResultScreen} options={{ title: '結果' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}