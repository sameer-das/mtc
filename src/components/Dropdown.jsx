import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { Modal, Portal, Text, useTheme } from 'react-native-paper';

const Dropdown = (props) => {
    const theme = useTheme();
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    const containerStyle = { backgroundColor: theme.colors.surfaceVariant, height: '50%', margin: 16, borderRadius: 8, justifyContent: 'flex-start', padding: 8 };

    const handleOptionPress = (item) => {
        props?.onSelect ? props.onSelect(item) : console.warn('No onSelect handler for dropdown is provided!')
        hideModal();
    }

    // if(props.label === 'Zone')
    //     console.log(props)

    return (
        <View style={{ display: 'flex', flexDirection: 'column' }}>
            <Text variant='labelSmall' style={{ color: theme.colors.primary }}>{props.label ? props.label : 'Select'}</Text>
            <Pressable onPress={showModal} style={{ ...styles.pressable, backgroundColor: theme.colors.title, borderColor: 'gray' }}>
                <Text variant="bodyLarge">{props.value?.label ? props?.value.label : 'Select'}</Text>
                <Portal>
                    <Modal visible={visible} dismissable={true} onDismiss={hideModal} contentContainerStyle={containerStyle}>
                        <Text variant='titleLarge' style={{ color: theme.colors.primary, textAlign: 'center', paddingVertical: 8 }}>{props.label ? props.label : 'Select'}</Text>
                        <View style={{ height: 300}}>
                            <FlatList showsVerticalScrollIndicator={true} data={props.options} renderItem={({ item }) => {
                                return <Pressable onPress={() => handleOptionPress(item)} key={item.value} style={{ ...styles.option }}>
                                        <Text variant='bodyMedium'>{item.label ? item.label : 'key: label not found in option obejct'}</Text>
                                    </Pressable>
                                }}>
                            </FlatList>
                        </View>
                    </Modal>
                </Portal>
            </Pressable>
        </View>

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
        borderBottomWidth: 1,
    }
})