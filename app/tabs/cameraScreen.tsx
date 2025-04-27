import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);
    const [squatAngle, setSquatAngle] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);

    if (!permission) return <View />;
    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text>İzin gerekiyor</Text>
                <Button onPress={requestPermission} title="İzin Ver" />
            </View>
        );
    }

    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }

    async function captureAndSendPhoto() {
        if (!cameraRef.current) {
            console.error('Kamera referansı yok');
            return;
        }

        try {
            setLoading(true);

            const photo = await cameraRef.current.takePictureAsync({ base64: true });

            if (!photo || !photo.base64) {
                console.error('Fotoğraf çekilemedi veya base64 verisi yok.');
                Alert.alert('Hata', 'Fotoğraf çekilemedi. Lütfen tekrar deneyin.');
                return;
            }

            const apiUrl = 'http://127.0.0.1:5001/squat'; // Burayı kendi IP adresine göre ayarla!

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: photo.base64 }),
            });

            if (!response.ok) {
                console.error('Sunucu hatası:', response.status);
                Alert.alert('Hata', 'Sunucu ile iletişim kurulamadı.');
                return;
            }

            const data = await response.json();
            console.log('Gelen veri:', data);

            if (data.squat_angle !== undefined && data.squat_angle !== null) {
                setSquatAngle(data.squat_angle);
            } else {
                console.error('Gelen veride squat açısı yok.');
                Alert.alert('Hata', 'Squat açısı alınamadı.');
            }

        } catch (error) {
            console.error('Fotoğraf gönderim hatası:', error);
            Alert.alert('Hata', 'Bir hata oluştu. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Kamerayı Çevir</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={captureAndSendPhoto} disabled={loading}>
                        <Text style={styles.text}>
                            {loading ? 'Yükleniyor...' : 'Fotoğraf Gönder'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </CameraView>

            {squatAngle !== null && (
                <View style={styles.angleContainer}>
                    <Text style={styles.angleText}>Squat Açısı: {squatAngle.toFixed(2)}°</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        margin: 32,
    },
    button: {
        flex: 1,
        alignSelf: 'flex-end',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    angleContainer: {
        padding: 20,
        alignItems: 'center',
    },
    angleText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});
