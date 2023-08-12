import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { COLOR_CORRECT, MAX_GUESSES } from '../constants/gameConstants';
import { firebase_auth, firestore_db } from '../../firebaseConfig';
import { setUserInfo } from '../store';
import { OFFLINE_USER } from '../constants/apiConstants';
import { useEffect, useState } from 'react';
import { onSnapshot, doc, setDoc } from 'firebase/firestore';

function ScoresModal({ closeModal, height, width }) {
  const dispatch = useDispatch();
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [largestStreak, setLargestStreak] = useState(0);
  const [guessDist, setGuessDist] = useState([]);
  const [resetStats, setResetStats] = useState(0);

  const { userInfo } = useSelector((state) => {
    return state.user;
  });

  useEffect(() => {
    if (userInfo.uid === OFFLINE_USER) {
      AsyncStorage.getItem('@scores').then((scoresJSON) => {
        if (scoresJSON) {
          const scoresData = JSON.parse(scoresJSON);
          setGamesPlayed(scoresData.gamesPlayed);
          setGamesWon(scoresData.gamesWon);
          setCurStreak(scoresData.curStreak);
          setLargestStreak(scoresData.largestStreak);
          setGuessDist(scoresData.guessDist);
        } else {
          const scoresData = {
            gamesPlayed: 0,
            gamesWon: 0,
            curStreak: 0,
            largestStreak: 0,
            guessDist: Array.from({ length: MAX_GUESSES }, () => 0),
          };
          AsyncStorage.setItem('@scores', JSON.stringify(scoresData)).then(
            () => {
              setGamesPlayed(scoresData.gamesPlayed);
              setGamesWon(scoresData.gamesWon);
              setCurStreak(scoresData.curStreak);
              setLargestStreak(scoresData.largestStreak);
              setGuessDist(scoresData.guessDist);
              console.log('Initialized Local Storage scores');
            }
          );
        }
      });
    } else {
      const ref = doc(firestore_db, `scores/${userInfo.uid}`);
      const subscriber = onSnapshot(ref, {
        next: (snapshot) => {
          const data = snapshot.data();
          if (data) {
            setGamesPlayed(data.gamesPlayed);
            setGamesWon(data.gamesWon);
            setCurStreak(data.curStreak);
            setLargestStreak(data.largestStreak);
            setGuessDist(data.guessDist);
          } else {
            setDoc(doc(firestore_db, 'scores', userInfo.uid), {
              gamesPlayed: 0,
              gamesWon: 0,
              curStreak: 0,
              largestStreak: 0,
              guessDist: Array.from({ length: MAX_GUESSES }, () => 0),
            });
            console.log('Doc Created');
          }
        },
      });

      return () => subscriber();
    }
  }, [userInfo, resetStats]);

  const handleOverlayPress = (event) => {
    event.stopPropagation();
    console.log('MODAL PRESSED');
  };

  const handleSignOut = async () => {
    await AsyncStorage.removeItem('@user');
    signOut(firebase_auth);
    dispatch(setUserInfo(null));
  };

  const clearLocalStats = async () => {
    await AsyncStorage.removeItem('@scores');
    setResetStats(resetStats + 1);
  };

  const max = Math.max(...guessDist);

  const histogram = guessDist.map((val, i) => {
    const w = val > 0 ? `${(100 * val) / max}%` : 'NaN%';
    return (
      <View key={i} style={styles.histogramBar}>
        <Text style={styles.axisNumber}>{i + 1}</Text>
        <View style={styles.barContainer}>
          <View style={[styles.bar, { width: w }]}>
            <Text style={styles.value}>{val}</Text>
          </View>
        </View>
      </View>
    );
  });

  return (
    <View
      style={[styles.container, { height, width }]}
      onTouchStart={handleOverlayPress}
    >
      <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
        <Ionicons name="close-outline" size={30} />
      </TouchableOpacity>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Statistics</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={styles.singleStateContainer}>
          <Text style={styles.stat}>{gamesPlayed}</Text>
          <Text style={styles.statLabel}>Played</Text>
        </View>
        <View style={styles.singleStateContainer}>
          <Text style={styles.stat}>{gamesWon}</Text>
          <Text style={styles.statLabel}>Won</Text>
        </View>
        <View style={styles.singleStateContainer}>
          <Text style={styles.stat}>
            {gamesPlayed > 0 ? Math.round((gamesWon * 100) / gamesPlayed) : 0}
          </Text>
          <Text style={styles.statLabel}>Win %</Text>
        </View>
        <View style={styles.singleStateContainer}>
          <Text style={styles.stat}>{curStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.singleStateContainer}>
          <Text style={styles.stat}>{largestStreak}</Text>
          <Text style={styles.statLabel}>Best Streak</Text>
        </View>
      </View>
      <View style={styles.histogramContainer}>{histogram}</View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={async () => handleSignOut()}
        >
          <Text>{userInfo.uid === OFFLINE_USER ? 'Sign In' : 'Sign Out'}</Text>
        </TouchableOpacity>
        {userInfo.uid === OFFLINE_USER && (
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={async () => clearLocalStats()}
          >
            <Text>Clear Stats</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    borderRadius: 5,
  },
  labelContainer: {
    padding: 10,
    marginTop: 50,
  },
  label: {
    fontSize: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'top',
    padding: 10,
  },
  singleStateContainer: {
    flex: 1,
    marginTop: 0,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  stat: {
    fontSize: 30,
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  histogramContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '80%',
    flex: 1,
    margin: 10,
  },
  histogramBar: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
  },
  axisNumber: {
    fontWeight: 'bold',
    width: '10%',
  },
  barContainer: {
    flex: 1,
    height: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bar: {
    height: '50%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: COLOR_CORRECT,
  },
  value: {
    fontWeight: 'bold',
    marginHorizontal: 5,
  },
  bottomContainer: {
    height: '20%',
  },
  signOutButton: {
    height: '30%',
    aspectRatio: 3,
    backgroundColor: 'lightgrey',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  signOutLabel: {
    fontWeight: 'bold',
  },
});

export default ScoresModal;
