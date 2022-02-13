import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { auth, firestore } from '../../firebase';

export const CreateRoom = ({ closeModal, setUpdateScreen }) => {
  const [room, setRoom] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const user = auth.currentUser;

  const handleCheckLimit = () => {
    if (room === '') {
      setErrorMessage('Fill in all fields!');
      return;
    }

    setLoading(true);

    firestore
      .collection('MESSAGES_THREADS')
      .get()
      .then((snapshot) => {
        let myThreads = 0;

        snapshot.docs.map((docItem) => {
          const roomOwner = docItem.data().owner;

          roomOwner === user.uid ? (myThreads += 1) : null;
        });

        if (myThreads >= 4) {
          setErrorMessage("You can't create more than 4 groups!");
          setLoading(false);
        } else {
          handleCreateRoom();
        }
      });
  };

  const handleCreateRoom = async () => {
    setLoading(true);

    await firestore
      .collection('MESSAGES_THREADS')
      .add({
        name: room,
        owner: user.uid,
        lastMessage: {
          createdAt: new Date(),
          text: `Welcome to the ${room} group!`,
        },
      })
      .then((snapshot) => {
        snapshot.collection('MESSAGES').add({
          createdAt: new Date(),
          text: `Welcome to the ${room} group!`,
          system: true,
        });

        setLoading(false);
        setErrorMessage('');
      });

    await closeModal(false);
    await setUpdateScreen((updateScreen) => !updateScreen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backGround}
        onPress={() => closeModal(false)}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <Text style={styles.label}>name of the room *</Text>
        <View style={styles.inputArea}>
          <Icon
            name="people-outline"
            type="ionicon"
            size={20}
            color="#abc4ff"
          />
          <TextInput
            style={styles.input}
            placeholder="Ex: React Native"
            placeholderTextColor="#555555"
            keyboardAppearance="dark"
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="words"
            value={room}
            onChangeText={setRoom}
          />
        </View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.button} onPress={handleCheckLimit}>
          <Text style={styles.buttonText}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" style={{ paddingTop: 5 }} />
            ) : (
              'create'
            )}
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#11111199',
  },
  backGround: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#181818',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 20,
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
    backgroundColor: '#111111',
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
});
