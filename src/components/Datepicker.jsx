import { StyleSheet, View } from 'react-native'
import React, { useState } from 'react'
import { Button, useTheme, Text } from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import Icon from '@react-native-vector-icons/material-design-icons'



const Datepicker = (props) => {
    const [open, setOpen] = useState(false)
    const theme = useTheme()

    return (
        <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant='labelSmall' style={{ color: theme.colors.primary }}>{props.label ? props.label : 'Choose Date'}</Text>

            <Button icon={() => <Icon name='calendar-month' size={20} color={theme.colors.onSurface} />} 
            style={{ borderRadius: 4, paddingVertical: 4 }} 
            textColor={theme.colors.onSurface} title="Open" 
            onPress={() => setOpen(true)} mode='outlined'> {props.date.toDateString()} </Button>
            <DatePicker
                modal
                open={open}
                date={props.date}
                mode='date'
                onConfirm={(date) => {
                    props.onConfirm(date)
                    setOpen(false)
                }}
                onCancel={() => {
                    setOpen(false)
                }}
            />
        </View>
    )
}

export default Datepicker

const styles = StyleSheet.create({})