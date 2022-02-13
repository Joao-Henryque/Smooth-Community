import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Lottie from 'lottie-react-native';
import ChatAnimation from '../../lottie/chat.json';
import { Icon } from 'react-native-elements';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { auth } from '../../firebase';
import { handleErrorAuth } from '../../utils';

export const SignIn = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const animationRef = React.useRef(null);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isVisible, setIsVisible] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    animationRef.current.play();
  }, [isFocused]);

  const handleSignIn = async () => {
    if (email === '' || password === '') {
      setErrorMessage('Fill in all fields!');
      return;
    }

    setLoading(true);

    await auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        setErrorMessage('');
        setEmail('');
        setPassword('');

        navigation.reset({
          index: 0,
          routes: [{ name: 'Rooms' }],
        });
      })
      .catch((error) => {
        handleErrorAuth(error.code, setErrorMessage);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.lottie}>
          <Lottie source={ChatAnimation} loop ref={animationRef} />
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>email *</Text>
          <View style={styles.inputArea}>
            <Icon
              name="mail-outline"
              type="ionicon"
              size={20}
              color="#abc4ff"
            />
            <TextInput
              style={styles.input}
              placeholder="example@example.com"
              placeholderTextColor="#555555"
              keyboardAppearance="dark"
              autoComplete="off"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>
          <Text style={styles.label}>password *</Text>
          <View style={styles.inputArea}>
            <Icon
              name="lock-closed-outline"
              type="ionicon"
              size={20}
              color="#abc4ff"
            />
            <TextInput
              style={styles.input}
              placeholder="******"
              placeholderTextColor="#555555"
              keyboardAppearance="dark"
              autoComplete="off"
              autoCorrect={false}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              secureTextEntry={!isVisible}
            />
            <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
              <Icon
                name={isVisible ? 'eye-off-outline' : 'eye-outline'}
                type="ionicon"
                size={25}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>
              {loading ? (
                <ActivityIndicator color="#FFFFFF" style={{ paddingTop: 5 }} />
              ) : (
                'sign in'
              )}
            </Text>
          </TouchableOpacity>
          <View style={styles.formNavigation}>
            <Text style={styles.navigationText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.navigationButton}>SignUp</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
  },
  content: {
    flex: 1,
    width: '90%',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: '100%',
    height: 180,
  },
  form: {
    marginTop: 20,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    textTransform: 'uppercase',
    marginBottom: 8,
    marginLeft: 10,
    letterSpacing: 1,
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 55,
    backgroundColor: '#181818',
    borderRadius: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 55,
    marginHorizontal: 10,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  errorMessage: {
    color: '#D00000',
    textAlign: 'center',
    fontSize: 15,
    letterSpacing: 1,
  },
  button: {
    marginVertical: 20,
    height: 55,
    backgroundColor: '#531BF9',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 25,
    textTransform: 'uppercase',
    letterSpacing: 3,
  },
  formNavigation: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
  },
  navigationText: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  navigationButton: {
    color: '#abc4ff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginLeft: 10,
  },
});
