import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function App() {
    const [facing, setFacing] = useState<CameraType>('back');
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<CameraView>(null);

    const [squatAngle, setSquatAngle] = useState<number | null>(null);
    const [squatStatus, setSquatStatus] = useState<'Doğru' | 'Yanlış' | null>(null);

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;


        if (permission?.granted) {
            interval = setInterval(() => {
                captureAndSendFrame();
            }, 1000); // 1 saniyede 1 kere gönder
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [permission]);

    const toggleCameraFacing = () => {
        setFacing((current) => (current === 'back' ? 'front' : 'back'));
    };

    const captureAndSendFrame = async () => {
        if (!cameraRef.current) return;

        try {
            const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });

            if (!photo?.base64) return;

            const response = await fetch('http://192.168.1.120:5001/squat', {
                // Burada IP adresini kendi local IP’n ile değiştir!
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: photo.base64 }),
            });

            const data = await response.json();
            const angle = data.squat_angle;

            if (angle !== undefined && angle !== null) {
                setSquatAngle(angle);

                // Doğruluk kontrolü
                if (angle >= 85 && angle <= 100) {
                    setSquatStatus('Doğru');
                } else {
                    setSquatStatus('Yanlış');
                }
            }
        } catch (error) {
            console.error('Hata:', error);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
                        <Text style={styles.text}>Kamerayı Çevir</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>

            <View style={styles.resultContainer}>
                {squatAngle !== null && (
                    <Text style={styles.angleText}>Açı: {squatAngle.toFixed(2)}°</Text>
                )}
                {squatStatus && (
                    <Text style={[styles.statusText, { color: squatStatus === 'Doğru' ? 'green' : 'red' }]}>
                        {squatStatus === 'Doğru' ? '✔️ Doğru Squat' : '❌ Yanlış Squat'}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    camera: { flex: 1 },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#00000080',
        padding: 10,
        borderRadius: 8,
    },
    text: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    resultContainer: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'white',
    },
    angleText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    statusText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
});
