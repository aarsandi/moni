import React, {useState} from 'react'
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import {register} from "../../store/profile/function"
import {useDispatch} from 'react-redux'

export default function Register({navigation}) {
    const dispatch = useDispatch()
    const [error, setError] = useState(null)
    const [dataRegister, setDataRegister] = useState({
        email: "",
        rekTabungan: "",
        rekDompet: ""
    })

    const onHandleChange = (value, field) => {
        setDataRegister({
            ...dataRegister,
            [field]: value
        })
    }

    const handleSubmit = () => {
        if(Object.keys(dataRegister).every((el) => dataRegister[el])) {
            register(dataRegister, dispatch, (el) => {
                if(el.message=="success") {
                    setError(null)
                    navigation.navigate("HomePageNavigator")
                }else{
                    setError("function error!")
                }
            })
        } else {
            setError("harap isi fieldnya")
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text>Register</Text>
            <TextInput onChangeText={text => onHandleChange(text, 'email')} placeholder="Email" style={ styles.textInput } placeholderTextColor="#838383" />
            <TextInput onChangeText={text => onHandleChange(text, 'rekTabungan')} placeholder="Rekening Tabungan Anda" style={ styles.textInput } placeholderTextColor="#838383" />
            <TextInput onChangeText={text => onHandleChange(text, 'rekDompet')} placeholder="Rekening Dompet Anda" style={ styles.textInput } placeholderTextColor="#838383" />

            <TouchableOpacity onPress={ handleSubmit } style={ { backgroundColor: '#ea8685' } }>
                <Text style={ { ...styles.buttonText, color: 'white' } }>Submit</Text>
            </TouchableOpacity>
            { 
                error && <Text>{error}</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        height: 40,
        borderRadius: 25,
        marginHorizontal: 20,
        paddingLeft: 10,
        marginVertical: 5,
        backgroundColor: "white",
        shadowColor: "#6e6d6d",
        shadowOffset: {
            width: 8,
            height: 8
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    }
})
