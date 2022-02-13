import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export const Messages = ({ data, userId }) => {
  const { text, system, user } = data;

  const isMyMessage = React.useMemo(() => {
    return user?.user.userId === userId;
  }, [data]);

  return (
    <View style={styles.container}>
      {system && (
        <View style={styles.system}>
          <Text style={[styles.text, { fontWeight: 'bold' }]}>{text}</Text>
        </View>
      )}
      {isMyMessage ? (
        <View style={styles.bodyMessage}>
          <Text style={styles.text}>{text}</Text>
        </View>
      ) : (
        !system && (
          <View
            style={[
              styles.bodyMessage,
              { alignSelf: 'flex-start', backgroundColor: '#181818' },
            ]}
          >
            <Text style={styles.name}>{user.user.userName}</Text>
            <Text style={styles.text}>{text}</Text>
          </View>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  system: {
    alignSelf: 'center',
    marginVertical: 10,
  },
  bodyMessage: {
    marginVertical: 10,
    backgroundColor: '#ABC4FF',
    padding: 10,
    maxWidth: '70%',
    alignSelf: 'flex-end',
    borderRadius: 10,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  name: {
    color: '#531BF9',
    letterSpacing: 1,
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
  },
});
