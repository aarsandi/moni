import React, {useEffect} from 'react'
import { View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux'
import { resetData, resetDataProfile } from '../../store/profile/function'

// Sreens
export default function HomepageNavigator({ navigation }) {
    const dispatch = useDispatch()
    const { rekTabungan, rekDompet, email } = useSelector((state) => state.profileReducer)

    useEffect(() => {
        if(!rekTabungan&&!rekDompet&&!email) {
            navigation.navigate("Splash")
        }
    }, [rekTabungan, rekDompet, email])

    return (
        <View>
            <Text>Home Navigator</Text>
            <Text>email: {email}</Text>
            <Text>rek tabungan: {rekTabungan}</Text>
            <Text>rek dompet: {rekDompet}</Text>

            <View style={{paddingVertical: 5}}>
                <Button title="Logout" onPress={() => resetData(dispatch, navigation)}/>
            </View>
        </View>
    )
}
