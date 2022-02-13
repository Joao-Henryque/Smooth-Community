import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { firestore } from '../../firebase';

export const ConfigRoomModal = ({
  data,
  closeConfigModal,
  setUpdateScreen,
}) => {
  const { name, roomId } = data;

  const [loading, setLoading] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [roomName, setRoomName] = React.useState(name);

  const handleConfigRoom = async () => {
    if (roomName === '') {
      setErrorMessage('Fill in the field!');
      return;
    }

    setLoading(true);

    await firestore
      .collection('MESSAGES_THREADS')
      .doc(roomId)
      .set(
        {
          name: roomName,
          lastMessage: {
            text: `Welcome to the ${roomName} group!`,
          },
        },
        { merge: true }
      );

    await closeConfigModal(false);
    await setUpdateScreen((updateScreen) => !updateScreen);
  };

  const handleDeleteRoom = async () => {
    await firestore.collection('MESSAGES_THREADS').doc(roomId).delete();
    await closeConfigModal(false);
    await setUpdateScreen((updateScreen) => !updateScreen);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => closeConfigModal(false)}
        style={styles.backGround}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        style={styles.content}
      >
        <Text style={styles.label}>Change the group name</Text>
        <View style={styles.inputArea}>
          <Icon
            name="create-outline"
            type="ionicon"
            size={20}
            color="#abc4ff"
          />
          <TextInput
            style={styles.input}
            placeholder=""
            placeholderTextColor="#555555"
            keyboardAppearance="dark"
            autoComplete="off"
            autoCorrect={false}
            autoCapitalize="words"
            value={roomName}
            onChangeText={setRoomName}
          />
        </View>
        <Text style={styles.errorMessage}>{errorMessage}</Text>
        <TouchableOpacity style={styles.button} onPress={handleConfigRoom}>
          <Text style={styles.buttonText}>change</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: '#D00000', marginVertical: 0 },
          ]}
          onPress={handleDeleteRoom}
        >
          <Text style={[styles.buttonText]}>delete</Text>
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
