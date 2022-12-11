import React, { useEffect, useState } from 'react'
import { View, Text, Button } from 'react-native'
import { stringifyDurak, stringifyYon } from "../_functions/functions";

import { MMKVLoader, useMMKVStorage } from 'react-native-mmkv-storage';


function Favourite({ yon, durak, time }) {
    const storage = new MMKVLoader().initialize();
    const [favourites, setFavourites] = useMMKVStorage('dataDeneme10', storage, '');
    let isCome = false;
    time === 0 ? isCome = true : isCome = false

    return (
        <View style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <View style={{
                margin: 10,
                alignItems: 'center',
                borderWidth: 1,
                borderRadius: 30,
                width: '95%',
                backgroundColor:
                    isCome ? 'orange' : 'aliceblue',
            }}>
                <Text style={{
                    fontSize: 10,
                    fontStyle: 'italic',
                    fontWeight: 'bold',
                    color: 'black'
                }}>{stringifyYon(yon)}</Text>

                <Text style={{
                    fontSize: 20,
                    color: 'black'
                }}>{stringifyDurak(durak)}</Text>

                <Text
                    style={{
                        color: 'black',
                        fontSize: time == 0 ? 23 : 30,
                        marginTop: time == 0 ? 6 : 0,
                        marginBottom: time == 0 ? 8 : 2
                    }}
                >{time == 0 ? '1 minutes içinde gelecek' : `${time} minutes`}</Text>
            </View>
        </View >
    )
}

export default Favourite

