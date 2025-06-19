import { Text, View, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import Button from '@/components/Button';

export default function Index() {
  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>🌐 DisasterSafe </Text>
        <Text style={styles.subtitle}>Stay prepared. Stay safe.</Text>
        
        <Link href='/about' style={styles.button}>
          <Text style={styles.arrow}>➤</Text> {/* Stylish arrow */}
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0f2027',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerContainer: {
    backgroundColor: '#203a43',
    padding: 30,
    borderRadius: 20,
    shadowColor: '#00c9ff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00c9ff',
    textShadowColor: '#0088a9',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#cfd8dc',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#00c9ff',
  },
  arrow: {
    fontSize: 28,
    color: '#0f2027',
    fontWeight: 'bold',
    textShadowColor: '#00f0ff',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  footerContainer: {
    flex: 1 / 3,
    alignItems: 'center',
  },
});
