import { StyleSheet, View, Pressable, Image, PermissionsAndroid } from 'react-native'
import React, { useState } from 'react'
import { Modal, Text, Portal, Button, IconButton } from 'react-native-paper'
import ImagePicker from 'react-native-image-crop-picker';
import Icon from '@react-native-vector-icons/material-design-icons'
import { useTheme } from 'react-native-paper';

interface ImagePickerProps {
    value: string,
    setValue: Function,
    placeholder: string,
    label: string,
    cropperCircleOverlay?: boolean,
    useFrontCamera?: boolean,
    compressImageQuality?: number,
    
}
const CustomImagePicker = ({ value, setValue, placeholder, label, cropperCircleOverlay, useFrontCamera, compressImageQuality }: ImagePickerProps) => {
    const theme = useTheme()
    const [visible, setVisible] = React.useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);


    const openGallery = async () => {
        hideModal();

        ImagePicker.openPicker({
            freeStyleCropEnabled: true,
            cropping: false,
            includeBase64: true,
            cropperActiveWidgetColor: theme.colors.primary,
            cropperCircleOverlay: cropperCircleOverlay || false, // add circle for cropping
            mediaType: 'photo',
            compressImageQuality: compressImageQuality || 0.3,
        }).then((image: any) => {
            setValue('data:image/jpeg;base64,' + image.data)
        }).catch(x => {
            console.log('Error in openPicker')
            console.log(x);
        });
    }
    const openCamera = async () => {
        hideModal();
        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA,
            {
                title: 'Camera Permission',
                message:
                    'ESeba needs access to your camera',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },)
        console.log(granted);

        ImagePicker.openCamera({
            freeStyleCropEnabled: true,
            cropping: false,
            includeBase64: true,
            cropperActiveWidgetColor: theme.colors.primary,
            cropperCircleOverlay: cropperCircleOverlay || false, // add circle for cropping
            mediaType: 'photo',
            useFrontCamera: useFrontCamera || false,
            compressImageQuality: compressImageQuality || 0.3,
        }).then((image: any) => {
            console.log(image);
            setValue('data:image/jpeg;base64,' + image.data)
        }).catch(x => {
            console.log('Error in openCamera')
            console.log(x);
        });
    }




    return (
        <>
            <View style={{}}>
                <Text style={styles.imageLabel}>{label}</Text>
                <Pressable style={[{height: value ? 100 : 50}, styles.border, styles.centerText, {borderColor: theme.colors.onSurface}]} onPress={showModal}>
                    {!value && <Text style={styles.uploadText}>{placeholder}</Text>}
                    {value && <Image source={{ uri: value }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />}
                </Pressable>
                {value ? <View style={styles.imageBottomControlContainer}>
                    <Text variant='labelSmall' style={{ color: theme.colors.tertiary }}>Tap on the image to upload again!</Text>
                    <IconButton icon='delete' iconColor={theme.colors.error} onPress={() => setValue('')} />
                </View> : <View style={styles.imageBottomControlContainer}></View>}
            </View>

            <Portal>
                <Modal visible={visible} dismissable={true} onDismiss={hideModal}
                    contentContainerStyle={{
                        backgroundColor: theme.colors.surfaceVariant,
                        height: '30%', margin: 16, borderRadius: 8, justifyContent: 'flex-start', padding: 8
                    }}>
                    <View style={modal.modalHeader}>
                        <Text style={{ ...modal.modalHeaderText, color: theme.colors.primary }}>Choose from</Text>
                    </View>
                    <Pressable style={modal.option} onPress={openCamera}>
                        <Icon name='camera' size={20} color={theme.colors.onSurface} />
                        <Text style={{ ...modal.optionLabel, color: theme.colors.onSurface }}>Camera</Text>
                    </Pressable>
                    <Pressable style={modal.option} onPress={openGallery}>
                        <Icon name='file-image' size={20} color={theme.colors.onSurface} />
                        <Text style={{ ...modal.optionLabel, color: theme.colors.onSurface }}>Gallery</Text>
                    </Pressable>

                    <View style={modal.bottomContainer}>
                        <Pressable onPress={hideModal}>
                            <Text style={{ ...modal.closeLabel, color: theme.colors.onSurface }}>Close</Text>
                        </Pressable>
                    </View>
                </Modal>
            </Portal>

        </>
    )
}

export default CustomImagePicker

const modal = StyleSheet.create({
    modalHeader: {
        paddingVertical: 8
    },
    modalHeaderText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    option: {
        paddingVertical: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomColor: 'grey',
        borderBottomWidth: 1
    },
    optionLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 12
    },
    bottomContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopColor: '#ccc',
        borderTopWidth: 0.5
    },
    closeLabel: {
        fontSize: 18,
        fontWeight: 'bold'
    }
})

const styles = StyleSheet.create({
    border: {        
        borderWidth: 1,
        borderRadius: 8
    },
    centerText: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploadText: {
        fontSize: 16,
    },
    imageLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4
    },
    imageBottomControlContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    uploadAgainText: {
        fontSize: 16,
        // color: colors.primary100,
        fontStyle: 'italic'
    },
    deleteButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 16,
        // backgroundColor: colors.secondary500,
    },
    deleteButtonText: {
        // color: colors.white,
        fontSize: 16,
        fontWeight: 'bold'
    },
})