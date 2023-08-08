import { Ionicons } from '@expo/vector-icons';
import { Modal, TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { COLOR_CORRECT } from '../constants/gameConstants';

function ScoresModal({visible, closeModal, height, width}){
    const {gamesPlayed, gamesWon, curStreak, largestStreak, guessDist} = useSelector((state) => {
        return state.scores;
    })

    const handleOverlayPress = (event) => {
        event.stopPropagation();
        console.log('MODAL PRESSED');
    }

    const max = Math.max(...guessDist);

    const histogram = guessDist.map((val, i) => {
        return(
            <View key={i} style={styles.histogramBar}>
                <Text style={styles.axisNumber}>{i+1}</Text>
                <View style={styles.barContainer}>
                    <View style={[styles.bar, {width: val>0 ? `${100*val/max}%` : 'NaN%'}]}>
                        <Text style={styles.value}>{val}</Text>
                    </View>
                </View>
            </View>
        )
    })

    return(
        <View style={[styles.container, {height, width}]} onTouchStart={handleOverlayPress}>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Ionicons name='close-outline' size={30}/>
            </TouchableOpacity> 
            <View style={styles.labelContainer}><Text style={styles.label}>Statistics</Text></View>
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
                    <Text style={styles.stat}>{gamesPlayed>0 ? Math.round(gamesWon*100/gamesPlayed): 0}</Text>
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
            <View style={styles.histogramContainer}>
                {histogram}
            </View>
            <View style={styles.bottomContainer}>

            </View>
        </View>
    )
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
        elevation: 5
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        borderRadius: 5,
    },
    labelContainer: {
        padding: 10,
        marginTop: 50
    },
    label: {
        fontSize: 20
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'top',
        padding: 10
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
        textAlign: 'center'
    },
    statLabel: {
        fontSize: 10,
        textAlign: 'center'
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
        width: '10%'
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
        backgroundColor: COLOR_CORRECT
    },
    value: {
        fontWeight: 'bold',
        marginHorizontal: 5
    },
    bottomContainer: {
        height: '20%'
    }

})

export default ScoresModal;