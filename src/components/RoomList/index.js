import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { Icon, Divider } from 'react-native-elements';
import { auth } from '../../firebase';
import { useNavigation } from '@react-navigation/native';

export const RoomList = ({ data, handleNavigation, openConfigModal }) => {
  const user = auth.currentUser;
  const navigation = useNavigation();

  const handleOpenChatRoom = () => {
    if (!user) return handleNavigation();

    navigation.navigate('ChatRoom', { data });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handleOpenChatRoom}>
      <View style={styles.layout}>
        <Text style={styles.name}>{data.name}</Text>
        <TouchableOpacity onPress={openConfigModal}>
          <Icon
            name="ellipsis-horizontal-outline"
            type="ionicon"
            size={25}
            color="#ABC4FF"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.lastMessage}>{data.lastMessage.text}</Text>
      <Divider color="#181818" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  layout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    letterSpacing: 1,
    fontSize: 18,
  },
  lastMessage: {
    color: '#555555',
    fontSize: 15,
    letterSpacing: 1,
    maxWidth: '90%',
    maxHeight: 30,
  },
});
