import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, useTheme } from 'react-native-paper';

const Dropdown = (props) => {
    const theme = useTheme();
    const [visible, setVisible] = React.useState(false);

    const initialValue = () => {
        if(props.value && typeof props.value === 'object') {
            return props.value
        } else if (props.value && typeof props.value === 'string') {
            return props.options.find(o => o.value === props.value);
        } else {
            return {label: '', value: ''}
        }
    }
    const [selected, setSelected] = useState(initialValue);

    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);
    
    const containerStyle = { backgroundColor: theme.colors.surfaceVariant, height: '50%', margin: 16, borderRadius: 8, justifyContent: 'flex-start', padding: 8 };

    const handleOptionPress = (item) => {
        console.log('selected ' , item);
        setSelected(item);
        props?.onSelect ? props.onSelect(item) : console.warn('No onSelect handler for dropdown is provided!')
        hideModal();
    }

    return (
        <>
            <Text variant='labelSmall' style={{ color: theme.colors.primary }}>{props.label ? props.label : 'Select'}</Text>
            <Pressable onPress={showModal} style={{ ...styles.pressable, backgroundColor: theme.colors.title, borderColor: 'gray' }}>
                <Text variant="bodyLarge">{selected.label ? selected.label : 'Select'}</Text>
                <Portal>
                    <Modal visible={visible} dismissable={true} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <Text variant='titleLarge' style={{ color:theme.colors.primary, textAlign: 'center', paddingVertical: 8 }}>{props.label ? props.label : 'Select'}</Text>
                        <View>
                            {props?.options && props.options.map((item, i) => {
                                return (<Pressable onPress={() => handleOptionPress(item)} key={item.value ? item.value : i} style={{...styles.option}}>
                                    <Text variant='bodyMedium'>{ item.label? item.label : 'key: label not found in option obejct'}</Text>
                                </Pressable>)
                            })}
                        </View>
                    </Modal>
                </Portal>
            </Pressable>
        </>

    )
}

export default Dropdown

const styles = StyleSheet.create({
    pressable: {
        width: '100%',
        paddingHorizontal: 16, paddingVertical: 12,
        borderWidth: 1,
        borderRadius: 4,
    },
    option: {
        paddingHorizontal: 8,
        paddingVertical: 14,
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    }
})