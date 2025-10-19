import { StyleSheet, View } from 'react-native'
import { ActivityIndicator, Portal, useTheme } from 'react-native-paper'

const Loading = ({visible}) => {
    const theme = useTheme();
    if (!visible) return null;
    return (
        <Portal>
            <View style={styles.overlay}>
                <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
            </View>
        </Portal>
    )
}

export default Loading

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, // Ensure it's on top
      },
})