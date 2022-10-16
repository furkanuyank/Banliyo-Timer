import { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
    RefreshControl
} from 'react-native';

import RadioForm from 'react-native-simple-radio-button';
import SelectDropdown from 'react-native-select-dropdown';

import data from '../_datas/data.json';
import { dropdownDatas, radioValues } from '../_datas/SelectableDatas'
import {
    convertToDateString,
    getMomentDateNumber,
    getCurrentTrain, getNextTrain,
    getRemainTime
} from '../_functions/functions'

function Main() {
    const [radioValue, setRadioValue] = useState('kayas-to-sincan');
    const [dropdownValue, setDropdownValue] = useState('-saimekadin');
    const [timeData, setTimeData] = useState(data['kayas-to-sincan']['-saimekadin'].times);

    useEffect(() => {
        setTimeData(data[`${radioValue}`][`${dropdownValue}`].times);
    }, [radioValue, dropdownValue])

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(100).then(() => setRefreshing(false));
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                backgroundColor='aliceblue'
            />
            <ScrollView
                contentContainerStyle={styles.container}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <RadioForm
                    radio_props={radioValues}
                    initial={0}
                    formHorizontal={true}
                    onPress={(value) => { setRadioValue(value) }}
                    style={{
                        margin: 20,
                    }}
                    labelStyle={{
                        marginLeft: 5,
                        marginRight: 10,
                    }}
                />

                <SelectDropdown
                    buttonStyle={styles.button}
                    buttonTextStyle={styles.buttonText}
                    dropdownStyle={styles.dropdown}
                    dropdownOverlayColor='transparent'

                    data={dropdownDatas.dropdownLabels}
                    defaultButtonText='Saimekadin'
                    onSelect={(selectedItem, index) => {
                        setDropdownValue(dropdownDatas.dropdownValues[index])
                    }}
                    buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                    }}
                    rowTextForSelection={(item, index) => {
                        return item
                    }}
                />

                <View>
                    {
                        //Outputs
                        getCurrentTrain(getMomentDateNumber(), timeData) == null
                            ? <Text style={{ color: 'black' }}>Bugün başka tren yok</Text>
                            : (
                                getNextTrain(getMomentDateNumber(), timeData) == null
                                    ? <View style={{
                                        alignItems: 'center'
                                    }}>
                                        <Text style={styles.currentTrain}>{`Current Train: ${convertToDateString(getCurrentTrain(getMomentDateNumber(), timeData))}`}</Text>
                                        <Text style={styles.nextTrain}>-</Text>
                                        {getRemainTime(getMomentDateNumber(), timeData) == 0
                                            ? <Text style={styles.remainTime1min}>1 dakika içinde gelecek</Text>
                                            : <Text style={styles.remainTime}>{`${getRemainTime(getMomentDateNumber(), timeData)} dakika`}</Text>
                                        }
                                    </View>
                                    : <View style={{
                                        alignItems: 'center'
                                    }}>
                                        <Text style={styles.currentTrain}>{`Current Train: ${convertToDateString(getCurrentTrain(getMomentDateNumber(), timeData))}`}</Text>
                                        <Text style={styles.nextTrain}>{`Next Train: ${convertToDateString(getNextTrain(getMomentDateNumber(), timeData))}`}</Text>
                                        {getRemainTime(getMomentDateNumber(), timeData) == 0
                                            ? <Text style={styles.remainTime1min}>1 dakika içinde gelecek</Text>
                                            : <Text style={styles.remainTime}>{`${getRemainTime(getMomentDateNumber(), timeData)} dakika`}</Text>
                                        }
                                    </View>
                            )
                    }
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'aliceblue',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentTrain: {
        marginTop: 20,
        fontSize: 30,
        color: 'black'
    },
    nextTrain: {
        marginTop: 20,
        fontSize: 25,
        color: 'black'
    },
    remainTime: {
        marginTop: 120,
        fontSize: 50,
        color: 'black'
    },
    remainTime1min: {
        marginTop: 120,
        fontSize: 30,
        color: 'black'
    },
    button: {
        backgroundColor: 'aliceblue',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
    },
    buttonText: {
        fontWeight: 'bold',
    },
    dropdown: {
        backgroundColor: 'aliceblue'
    },
});

export default Main