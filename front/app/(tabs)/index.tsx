import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}>
          Escaneo 3D desde cero
        </ThemedText>
      </ThemedView>
      <ThemedText>
        Crear un proyecto de escaneo 3D combina tres mundos: captura de imágenes,
        fotogrametría y renderizado 3D. La estrategia estándar es capturar en el móvil y
        procesar en un servidor o API.
      </ThemedText>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">1. Arquitectura del proyecto</ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Frontend:</ThemedText> React Native con Expo para la
          cámara y GL.
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Backend:</ThemedText> API en Python con AliceVision o
          Colmap, o servicios como RealityScan/Polycam.
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Visualización:</ThemedText> React Three Fiber (R3F)
          para mostrar el modelo.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">2. Frontend con Expo</ThemedText>
        <ThemedText>
          Librerías clave: <ThemedText type="defaultSemiBold">expo-camera</ThemedText>,{' '}
          <ThemedText type="defaultSemiBold">expo-gl</ThemedText>,{' '}
          <ThemedText type="defaultSemiBold">three</ThemedText>,{' '}
          <ThemedText type="defaultSemiBold">@react-three/fiber</ThemedText> y{' '}
          <ThemedText type="defaultSemiBold">@react-three/drei</ThemedText>.
        </ThemedText>
        <ThemedText>
          Configuración inicial: <ThemedText type="defaultSemiBold">npx create-expo-app</ThemedText>{' '}
          y luego <ThemedText type="defaultSemiBold">expo install</ThemedText> para las dependencias.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">3. Lógica de generación</ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Opción A:</ThemedText> enviar 20-50 fotos al backend
          para generar un .glb/.obj con fotogrametría.
        </ThemedText>
        <ThemedText>
          <ThemedText type="defaultSemiBold">Opción B:</ThemedText> usar sensores LiDAR/Depth en
          móviles compatibles para malla en tiempo real.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">4. Renderizado en la app y web</ThemedText>
        <ThemedText>
          Con <ThemedText type="defaultSemiBold">React Three Fiber</ThemedText> cargas el modelo y
          lo visualizas con controles de órbita.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Próximo paso recomendado</ThemedText>
        <ThemedText>
          ¿Quieres que prepare el componente de cámara que capture fotos cada 2 segundos para
          facilitar el escaneo?
        </ThemedText>
        <ExternalLink href="https://www.youtube.com/watch?v=tqnB5qS15oA">
          <ThemedText type="link">
            Aprende a renderizar modelos 3D con React Three Fiber
          </ThemedText>
        </ExternalLink>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
