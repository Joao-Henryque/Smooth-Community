import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import { SignIn } from '../pages/SignIn';
import { SignUp } from '../pages/SignUp';
import { Rooms } from '../pages/Rooms';
import { ChatRoom } from '../pages/ChatRoom';

const Stack = createStackNavigator();

export const StackRoute = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forFadeFromCenter,
      }}
      initialRouteName="Rooms"
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Rooms" component={Rooms} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation,
        }}
      />
    </Stack.Navigator>
  );
};
