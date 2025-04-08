import { StyleSheet, View, Pressable, Text } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

type Props = {
    label: string;
    theme?: 'primary' | 'secondary';
    onPress?: () => void;
    selected?: boolean;
};

export default function Button({ label, theme = 'secondary', onPress, selected = false }: Props) {
    const isPrimary = theme === 'primary';

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else {
            alert(`You pressed the ${theme} button.`);
        }
    };

    const backgroundColor = selected
        ? '#0277BD'
        : isPrimary
            ? '#fff'
            : '#0277BD';

    const textColor = selected ? 'white' : isPrimary ? 'black' : '#fff';

    return (
        <View
            style={[
                styles.buttonContainer,
                isPrimary && { borderWidth: 4, borderColor: 'white', borderRadius: 18 },
            ]}>
            <Pressable
                style={[styles.button, { backgroundColor }]}
                onPress={handlePress}>

                {/* Sol ikon (sadece primary'de) */}
                {isPrimary && (
                    <FontAwesome
                        name="picture-o"
                        size={18}
                        color={textColor}
                        style={styles.buttonIcon}
                    />
                )}

                {/* Label */}
                <Text style={[styles.buttonLabel, { color: textColor }]}>
                    {label}
                </Text>

                {/* Tik işareti (seçiliyse) */}
                {selected && (
                    <FontAwesome
                        name="check"
                        size={20}
                        color="white"
                        style={styles.checkIcon}
                    />
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'space-between', // ✅ sağa sola ikonlar için
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    buttonIcon: {
        paddingRight: 8,
    },
    buttonLabel: {
        fontSize: 16,
    },
    checkIcon: {
        marginLeft: 10,
    },
});
