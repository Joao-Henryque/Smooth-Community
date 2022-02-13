import React from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { useRoute } from '@react-navigation/native';
import { Header } from '../../components/Header';
import { Messages } from '../../components/Messages';
import { auth, firestore } from '../../firebase';

export const ChatRoom = () => {
  const route = useRoute();
  const { name, roomId } = route.params?.data;

  const user = auth.currentUser;

  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState([]);

  const handleSendMessage = async () => {
    if (text === '') return;

    await firestore
      .collection('MESSAGES_THREADS')
      .doc(roomId)
      .collection('MESSAGES')
      .add({
        text,
        createdAt: new Date(),
        user: {
          userId: user.uid,
          userName: user.displayName,
        },
      });

    await firestore
      .collection('MESSAGES_THREADS')
      .doc(roomId)
      .set(
        {
          lastMessage: {
            text,
            createdAt: new Date(),
          },
        },
        { merge: true }
      );

    setText('');
  };

  React.useEffect(() => {
    const loadMessages = firestore
      .collection('MESSAGES_THREADS')
      .doc(roomId)
      .collection('MESSAGES')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messages = querySnapshot.docs.map((docItem) => {
          const data = {
            _id: docItem.id,
            text: '',
            createdAt: new Date(),
            ...docItem.data(),
          };

          if (!docItem.data().system) {
            data.user = {
              ...docItem.data(),
              name: user.displayName,
            };
          }

          return data;
        });

        setMessages(messages);
      });

    return () => loadMessages();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Header title={name} />
      <View style={styles.content}>
        <FlatList
          style={{ flex: 1, paddingVertical: 20 }}
          data={messages}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <Messages data={item} userId={user.uid} />}
          inverted
        />
        <KeyboardAvoidingView
          style={styles.sendMessage}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={110}
        >
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            placeholderTextColor="#555555"
            keyboardAppearance="dark"
            multiline
            value={text}
            onChangeText={setText}
          />
          <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
            <Icon
              name="send-outline"
              type="ionicon"
              size={25}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
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
  },
  sendMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    height: 55,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
    paddingHorizontal: 10,
    backgroundColor: '#181818',
    borderRadius: 10,
    flex: 5,
  },
  button: {
    minHeight: 55,
    maxHeight: 2000,
    backgroundColor: '#531BF9',
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
});
