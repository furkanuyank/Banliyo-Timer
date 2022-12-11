import { Image, TouchableOpacity, Text, View, SafeAreaView, ScrollView, RefreshControl, Button } from 'react-native'
import { useState, useCallback, useEffect } from 'react'
import data from '../_datas/data.json'
import {
    getMomentDateNumber,
    getRemainTime
} from '../_functions/functions'
import Favourite from "../_components/Favourite";
import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';
import { useIsFocused } from '@react-navigation/native'
function Favourites({ navigation }) {


    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }
    const [refreshing, setRefreshing] = useState(false);
    const onRefresh = useCallback(() => {
        setRefreshing(true);
        wait(100).then(() => setRefreshing(false));
    }, []);
    const storage = new MMKVLoader().initialize();
    const [favourites, setFavourites] = useMMKVStorage('dataDeneme10', storage, '');
    const [update, setUpdate] = useState(false)
    const isFocused = useIsFocused();
    let moment = new Date();
    let yonArray = [];
    let durakArray = [];
    {
        favourites.split('|').map((data, i) => {
            if (i != 0) {
                const tempArray = data.split(',');
                yonArray.push(tempArray[0]);
                durakArray.push(tempArray[1]);
            }
        })

        useEffect(() => {
            setInterval(() => {
                moment = new Date();
                if (moment.getSeconds() < 5) {
                    setUpdate(!update)
                }
            }, 5000)
        }, [])

        return (
            <SafeAreaView style={{
                backgroundColor: 'aliceblue',
                height: "100%"
            }}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                        />
                    }>

                    {favourites.length == 0
                        ? <Text style={{ fontSize: 45, color: '#A0A0A0', textAlign: 'center', marginTop: 200 }}>Favoriler boş</Text>
                        : <Text style={{ fontSize: 0 }}></Text>}

                    <View style={{ marginTop: 30 }}>
                        {yonArray.map((yon, i) => {
                            return <View
                                key={i}
                                style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    marginHorizontal: 20,
                                }}
                            >
                                <Favourite
                                    yon={yon}
                                    durak={durakArray[i]}
                                    time={getRemainTime(getMomentDateNumber(), data[yon][durakArray[i]].times)}>
                                </Favourite>
                                <TouchableOpacity
                                    onPress={() => setFavourites(favourites.replace(`|${yon},${durakArray[i]}`, ""))}
                                    style={{
                                        width: 30, height: 30, backgroundColor: 'transparent', alignSelf: 'center', alignItems: 'center', justifyContent: 'center'
                                        , borderRadius: 50, position: 'absolute', right: 3, top: 3
                                    }}
                                ><Image style={{ width: 25, height: 25, backgroundColor: 'yellow', borderRadius: 50 }} source={require('../_icons/delete.png')}></Image></TouchableOpacity>
                            </View>
                        })}
                    </View>
                </ScrollView >
            </SafeAreaView >
        )
    }
}
export default Favourites