import { View, StyleSheet, ImageBackground, Alert } from 'react-native';
import { useState } from 'react';
import Button from '@/components/Button';

export default function Index() {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleStart = () => {
    if (selectedOption) {
      Alert.alert(`Seçilen egzersiz: ${selectedOption}`);
      // burada navigation veya başka bir işleme yönlendirebilirsin
    } else {
      Alert.alert("Lütfen bir egzersiz seçin!");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/wpaper.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.footerContainer}>
          <View style={{ marginTop: 100 }}>
            <Button
              label="Squat"
              selected={selectedOption === 'Squat'}
              onPress={() => setSelectedOption('Squat')}
            />

            <Button
              label="Bridge"
              selected={selectedOption === 'Bridge'}
              onPress={() => setSelectedOption('Bridge')}
            />
          </View>
          <View style={{ marginTop: 100 }}>
            <Button
              theme="primary"
              label="Başla"
              onPress={() => {
                if (selectedOption) {
                  alert(`Seçilen egzersiz: ${selectedOption}`);
                } else {
                  alert("Lütfen bir egzersiz seçin.");
                }
              }}
            />
          </View>


        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
});
