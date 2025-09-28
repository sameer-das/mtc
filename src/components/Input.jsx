import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput, TextInputProps, useTheme } from 'react-native-paper'

const Input = (props) => {
    const theme = useTheme();
    return (
        <TextInput
            {...props}
            mode='outlined'
            style={{
                backgroundColor: theme.colors.surface2,
                fontSize: 16,
            }}

        />
    )
}

export default Input
