import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import { useRouter } from 'expo-router';

export default function AboutScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🚨 Emergency Panel</Text>
      <Text style={styles.subheading}>Access quick actions for safety</Text>

      <ScrollView contentContainerStyle={styles.footerContainer}>
        <Button label="📍 SEE MAP" />

        <View style={styles.container}>
      <MapView style={styles.map} />
    </View>
        <Button label="🧭 PLAN ROUTE" onPress={() => router.push('/route')} />

        <Button label="🚨 EMERGENCY" />
        <Button label="📢 REPORT INCIDENTS" onPress={()=>router.push('/view_report')}/>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f2027', // Deep background
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#00c9ff',
    textShadowColor: '#0077b6',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 16,
    color: '#cfd8dc',
    marginBottom: 30,
  },
  footerContainer: {
    alignItems: 'center',
    gap: 20,
  },
});
