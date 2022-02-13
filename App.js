import 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { StackRoute } from './src/routes/StackRoute';

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StackRoute />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
