import { View, StyleSheet, ImageBackground } from 'react-native';

import Button from '@/components/Button';


export default function Index() {
  return (
    <ImageBackground
      source={require("../../assets/images/wpaper.jpg")} // Resim dosyanın konumuna göre değiştir
      style={styles.background}
    >
      <View style={styles.container}>

        <View style={styles.footerContainer}>
          <Button label="" />
          <Button theme="primary" label="Başla" />
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
  imageContainer: {
    flex: 1,
    paddingTop: 28,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
  background: {
    flex: 1,
    resizeMode: "cover", // "contain" veya "stretch" de kullanılabilir
    justifyContent: "center",
    alignItems: "center",
  },
});
