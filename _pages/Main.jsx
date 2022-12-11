import { useState, useEffect, useCallback } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    StatusBar,
    Text,
    View,
    RefreshControl,
    Image,
    TouchableOpacity,
} from 'react-native';

import RadioForm from 'react-native-simple-radio-button';
import SelectDropdown from 'react-native-select-dropdown';
import { useIsFocused } from '@react-navigation/native'
import data from '../_datas/data.json';
import { dropdownDatas, radioValues } from '../_datas/SelectableDatas'
import {
    convertToDateString,
    getMomentDateNumber,
    getCurrentTrain,
    getNextTrain,
    getRemainTime,
    stringifyDurak
} from '../_functions/functions'
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
function Main({ navigation }) {
    const storage = new MMKVLoader().initialize();

    const [favourites, setFavourites] = useMMKVStorage('dataDeneme10', storage, '');
    const [defaultDurak, setDefaultDurak] = useMMKVStorage('durakdeneme3', storage, '-saimekadin');
    const [defaultYon, setDefaultYon] = useMMKVStorage('yonDeneme3', storage, 'kayas-to-sincan');

    const [dropdownValue, setDropdownValue] = useState(defaultDurak);
    const [radioValue, setRadioValue] = useState(defaultYon);
    const [timeData, setTimeData] = useState(data[defaultYon][defaultDurak].times);
    const isFocused = useIsFocused();
    const [update, setUpdate] = useState(false)
    let moment = new Date();

    useEffect(() => {
        setInterval(() => {
            const moment = new Date();
            if (moment.getSeconds() < 5) {
                setUpdate(!update)
            }
        }, 5000)
    }, [])

    useEffect(() => {
        setTimeData(data[`${radioValue}`][`${dropdownValue}`].times);
    }, [radioValue, dropdownValue])

    useEffect(() => {
        setDefaultDurak(dropdownValue)
    }, [dropdownValue])

    useEffect(() => {
        setDefaultYon(radioValue)
    }, [radioValue])

    function removeFavourites() {
        setFavourites(favourites.replace(`|${radioValue},${dropdownValue}`, ""))
    }
    function addFavourites() {
        setFavourites(`${favourites}|${radioValue},${dropdownValue}`)
    }

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
                animated={true}
                barStyle='dark-content'
            />
            <ScrollView
                contentContainerStyle={styles.container}

                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }>
                <Text style={{ fontSize: 70, color: 'black', marginBottom: 30 }}>
                    {moment.getHours() / 10 < 1 ? `0${moment.getHours()} ` : `${moment.getHours()} `}
                    :
                    {moment.getMinutes() / 10 < 1 ? ` 0${moment.getMinutes()}` : ` ${moment.getMinutes()}`}</Text>

                <RadioForm
                    radio_props={radioValues}
                    initial={defaultYon == 'kayas-to-sincan' ? 0 : 1}
                    formHorizontal={true}
                    onPress={(value) => { setRadioValue(value) }}
                    style={{
                        margin: 20,
                    }}
                    labelStyle={{
                        marginLeft: 5,
                        marginRight: 10,
                        fontSize: 15,
                        fontWeight: 'bold'
                    }}
                />
                <SelectDropdown
                    buttonStyle={styles.button}
                    buttonTextStyle={styles.buttonText}
                    dropdownStyle={styles.dropdown}
                    dropdownOverlayColor='transparent'

                    data={radioValue == 'sincan-to-kayas' ? dropdownDatas.SKdropdownLabels : dropdownDatas.KSdropdownLabels}
                    defaultButtonText={stringifyDurak(defaultDurak)}
                    defaultValue={defaultDurak}
                    onSelect={(selectedItem, index) => {
                        setDropdownValue(radioValue == 'sincan-to-kayas' ? dropdownDatas.SKdropdownValues[index] : dropdownDatas.KSdropdownValues[index])
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
                                            : getRemainTime(getMomentDateNumber(), timeData) / 60 < 1
                                                ? <Text style={styles.remainTimeLong}>{`${getRemainTime(getMomentDateNumber(), timeData)} dakika`}</Text>
                                                : <Text style={styles.remainTimeLong}>{`${Math.floor((getRemainTime(getMomentDateNumber(), timeData) / 60))} saat ${Math.floor((getRemainTime(getMomentDateNumber(), timeData) % 60))} dakika`}</Text>
                                        }
                                    </View>
                                    : <View style={{
                                        alignItems: 'center'
                                    }}>
                                        <Text style={styles.currentTrain}>{`Current Train: ${convertToDateString(getCurrentTrain(getMomentDateNumber(), timeData))}`}</Text>
                                        <Text style={styles.nextTrain}>{`Next Train: ${convertToDateString(getNextTrain(getMomentDateNumber(), timeData))}`}</Text>
                                        {getRemainTime(getMomentDateNumber(), timeData) == 0
                                            ? <Text style={styles.remainTime1min}>1 dakika içinde gelecek</Text>
                                            : getRemainTime(getMomentDateNumber(), timeData) / 60 < 1
                                                ? <Text style={styles.remainTimeLong}>{`${getRemainTime(getMomentDateNumber(), timeData)} dakika`}</Text>
                                                : <Text style={styles.remainTimeLong}>{`${Math.floor((getRemainTime(getMomentDateNumber(), timeData) / 60))} saat ${Math.floor((getRemainTime(getMomentDateNumber(), timeData) % 60))} dakika`}</Text>

                                        }
                                    </View>
                            )
                    }
                </View>
                <View>
                    {
                        favourites.includes(`|${radioValue},${dropdownValue}`)
                            ? <TouchableOpacity onPress={removeFavourites}><Image style={{ width: 50, height: 50 }} source={require('../_icons/star_selected.png')}></Image></TouchableOpacity>
                            : <TouchableOpacity onPress={addFavourites}><Image style={{ width: 50, height: 50 }} source={require('../_icons/star_empty.png')}></Image></TouchableOpacity>
                    }
                </View>
            </ScrollView>
        </SafeAreaView >
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
        marginTop: 80,
        fontSize: 50,
        color: 'black'
    },
    remainTimeLong: {
        marginTop: 80,
        fontSize: 40,
        color: 'black'
    },
    remainTime1min: {
        marginTop: 80,
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