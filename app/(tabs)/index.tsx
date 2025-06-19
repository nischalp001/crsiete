import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Text } from 'react-native';
import HomeScreenContent from '../../screens/HomeScreenContent'; // adjust path if needed

const Stack = createStackNavigator();

function HeaderTitle() {
  return (
    <Text style={{
      fontFamily: 'AkayaKanadaka_400Regular',
      fontSize: 25,
      marginLeft: 10,
    }}>
      Crseite
    </Text>
  );
}

export default function HomeStack() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreenContent}
        options={{
          headerTitle: () => <HeaderTitle />,
          headerStyle: {
            backgroundColor: '#fff',
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      />
    </Stack.Navigator>
  );
}
