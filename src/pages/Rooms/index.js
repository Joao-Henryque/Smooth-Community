import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  Modal,
  TextInput,
} from 'react-native';
import { auth, firestore } from '../../firebase';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { CreateRoom } from '../../components/Modal/CreateRoom';
import { Icon } from 'react-native-elements';
import Lottie from 'lottie-react-native';
import ChatLogo from '../../lottie/chatRoom.json';
import LoadingLottie from '../../lottie/loading.json';
import { RoomList } from '../../components/RoomList';
import { ConfigRoomModal } from '../../components/Modal/ConfigRoomModal';

console.disableYellowBox;

export const Rooms = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const user = auth.currentUser;

  const [updateScreen, setUpdateScreen] = React.useState(false);
  const [modalVisible, setModalVisible] = React.useState(false);
  const [configRoomModal, setConfigRoomModal] = React.useState(false);
  const [loading, setloading] = React.useState(true);
  const [search, setsearch] = React.useState('');
  const [rooms, setRooms] = React.useState([]);
  const [data, setData] = React.useState(null);

  const animationRef = React.useRef(null);
  const loadingRef = React.useRef(null);

  const handleSearchRoom = async (value) => {
    setsearch(value);

    await firestore
      .collection('MESSAGES_THREADS')
      .orderBy('name')
      .startAt(search)
      .endAt(search + '\uf8ff')
      .get()
      .then((snapshot) => {
        const threads = snapshot.docs.map((docItem) => {
          return {
            roomId: docItem.id,
            name: '',
            lastMessage: { text: '' },
            ...docItem.data(),
          };
        });

        setRooms(threads);
      });
  };

  const handleNavigation = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const handleOpenModal = () => {
    if (!user) return handleNavigation();

    setModalVisible(true);
  };

  const handleSignOut = () => {
    auth.signOut();
    handleNavigation();
  };

  const handleConfigRoom = (data) => {
    if (!user) return handleNavigation();

    if (data.owner !== user.uid) return;

    setConfigRoomModal(true);
    setData(data);
  };

  React.useEffect(() => {
    animationRef.current.play();
  }, [isFocused]);

  React.useEffect(() => {
    let isActive = true;

    const getRooms = async () => {
      setloading(true);

      if (loadingRef.current) await loadingRef.current.play();

      await firestore
        .collection('MESSAGES_THREADS')
        .orderBy('lastMessage.createdAt', 'desc')
        .limit(10)
        .get()
        .then((snapshot) => {
          const threads = snapshot.docs.map((docItem) => {
            return {
              roomId: docItem.id,
              name: '',
              lastMessage: { text: '' },
              ...docItem.data(),
            };
          });

          if (isActive) {
            setRooms(threads);
            setloading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    getRooms();

    return () => (isActive = false);
  }, [isFocused, updateScreen]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>welc</Text>
          <View style={styles.lottie}>
            <Lottie source={ChatLogo} loop ref={animationRef} />
          </View>
          <Text style={styles.title}>me</Text>
        </View>
        <View style={styles.inputArea}>
          <Icon
            name="search-outline"
            type="ionicon"
            size={20}
            color="#ABC4FF"
          />
          <TextInput
            style={styles.input}
            placeholder="Search by room name"
            placeholderTextColor="#555555"
            keyboardAppearance="dark"
            autoComplete="off"
            autoCorrect={false}
            value={search}
            onChangeText={(value) => handleSearchRoom(value)}
          />
        </View>
        {loading ? (
          <View style={styles.loadingLottie}>
            <Lottie
              source={LoadingLottie}
              loop
              ref={loadingRef}
              style={{ width: 100, height: 100 }}
            />
          </View>
        ) : rooms.length === 0 ? (
          <View style={styles.empytListArea}>
            <Text style={styles.empytListText}>
              Be the first to create a group.
            </Text>
          </View>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            data={rooms}
            keyExtractor={(item) => item.roomId}
            renderItem={({ item }) => (
              <RoomList
                data={item}
                handleNavigation={handleNavigation}
                openConfigModal={() => handleConfigRoom(item)}
              />
            )}
          />
        )}
        <View style={styles.footer}>
          {user && (
            <TouchableOpacity onPress={handleSignOut}>
              <Icon
                name="log-out-outline"
                type="ionicon"
                size={25}
                color="#D00000"
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleOpenModal}>
            <Icon
              name="create-outline"
              type="ionicon"
              size={25}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal transparent={true} visible={modalVisible} animationType="slide">
        <CreateRoom
          closeModal={setModalVisible}
          setUpdateScreen={setUpdateScreen}
        />
      </Modal>
      <Modal transparent={true} visible={configRoomModal} animationType="slide">
        <ConfigRoomModal
          closeConfigModal={setConfigRoomModal}
          data={data && data}
          setUpdateScreen={setUpdateScreen}
        />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111111',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '90%',
  },
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 3,
    textShadowColor: '#ABC4FF',
    textShadowOffset: { width: -3, height: 3 },
    textShadowRadius: 1,
  },
  lottie: {
    width: 40,
    height: 40,
  },
  loadingLottie: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empytListArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  empytListText: {
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
    textAlign: 'center',
  },
  inputArea: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 55,
    backgroundColor: '#181818',
    borderRadius: 10,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 55,
    marginHorizontal: 10,
    color: '#FFFFFF',
    fontSize: 15,
    letterSpacing: 1,
  },
  footer: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
