import { StyleSheet, View } from 'react-native'
import React from 'react'
import { TextInput, TextInputProps, useTheme, Text } from 'react-native-paper'

const Input = (props) => {
    const theme = useTheme();
    return (
        <View style={{display:'flex', flexDirection:'column'}}> 
         <Text variant='labelSmall' style={{ color: theme.colors.primary }}>{props.label ? props.label : 'Select'}</Text>
        <TextInput
            {...props}
            label=''
            mode='outlined'
            dense
            style={{
                backgroundColor: theme.colors.surface2,
                fontSize: 16,
                height: 50
            }}
        />
        </View>
        
    )
}

export default Input
