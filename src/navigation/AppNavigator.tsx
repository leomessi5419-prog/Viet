import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '../screens/HomeScreen';
import { DistrictScreen } from '../screens/DistrictScreen';
import { CharacterScreen } from '../screens/CharacterScreen';
import { DialogueScreen } from '../screens/DialogueScreen';
import { ToneScreen } from '../screens/ToneScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/theme';

export type RootStackParamList = {
  Home: undefined;
  District: { districtId: string };
  Character: { characterId: string };
  Dialogue: { characterId: string; lessonId: string };
  Tones: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bgBase,
    card: colors.bgBase,
    text: colors.textBright,
    border: colors.bgInset,
    primary: colors.neonPink,
  },
};

export const AppNavigator: React.FC = () => (
  <NavigationContainer theme={navTheme}>
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgBase },
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="District" component={DistrictScreen} />
      <Stack.Screen name="Character" component={CharacterScreen} />
      <Stack.Screen name="Dialogue" component={DialogueScreen} />
      <Stack.Screen name="Tones" component={ToneScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
