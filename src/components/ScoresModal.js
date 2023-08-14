import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { signOut } from 'firebase/auth';
import { COLOR_CORRECT } from '../constants/gameConstants';
import { firebase_auth } from '../../firebaseConfig';
import { resetGuesses, setUserInfo } from '../store';
import { OFFLINE_USER } from '../constants/apiConstants';
import { useEffect, useState } from 'react';
import { getScoresLocal } from '../apis/local-store';
import { getScoresFB } from '../apis/firebase-store';
import Modal from './Modal';

function ScoresModal({ closeModal, height, width }) {
  const dispatch = useDispatch();

  // States
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [gamesWon, setGamesWon] = useState(0);
  const [curStreak, setCurStreak] = useState(0);
  const [largestStreak, setLargestStreak] = useState(0);
  const [guessDist, setGuessDist] = useState([]);
  const [resetStats, setResetStats] = useState(0); // State used to trigger useEffect
  const { userInfo } = useSelector((state) => state.user);

  // Get and Update scores
  useEffect(() => {
    if (userInfo.uid === OFFLINE_USER) {
      // If playing offline, use local async storage
      getScoresLocal().then((scoresData) => {
        setGamesPlayed(scoresData.gamesPlayed);
        setGamesWon(scoresData.gamesWon);
        setCurStreak(scoresData.curStreak);
        setLargestStreak(scoresData.largestStreak);
        setGuessDist(scoresData.guessDist);
      });
    } else {
      // If logged in, use firebase
      const subscriber = getScoresFB(
        userInfo.uid,
        setGamesPlayed,
        setGamesWon,
        setCurStreak,
        setLargestStreak,
        setGuessDist
      );

      return () => subscriber();
    }
  }, [userInfo, resetStats]);

  // Handle press of sign out button
  const handleSignOut = async () => {
    // Clear user info stored locally for persistence
    await AsyncStorage.removeItem('@user');
    signOut(firebase_auth);
    dispatch(setUserInfo(null));
    dispatch(resetGuesses()); // reset game as well
  };

  // Handle press of reset stats button
  const clearLocalStats = async () => {
    await AsyncStorage.removeItem('@scores');
    // trigger rerender of stats
    setResetStats(resetStats + 1);
  };

  // Build histogram of distribution of guesses
  const max = Math.max(...guessDist);
  const histogram = guessDist.map((val, i) => {
    // width of bar dependent on percentage of max value
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
    <Modal height={height} width={width} closeModal={closeModal}>
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
    </Modal>
  );
}

const styles = StyleSheet.create({
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
