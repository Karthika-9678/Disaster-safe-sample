import { View, Text, Pressable, StyleSheet } from 'react-native';
import { router,useRouter } from 'expo-router';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';

export default function ViewReportScreen() {
  const router = useRouter();

  return (
    <View style={styles.outerContainer}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>🚨 DisasterSafe</Text>
        <Text style={styles.subtitle}>Stay Safe. Report and View Incidents Near You.</Text>

        <Pressable
          style={[styles.button, styles.reportButton]}
          onPress={() => router.push('/report')}
        >
          <Text style={styles.arrow}>📝 Report Incident</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.viewButton]}
          onPress={() => router.push('/IncidentListScreen')}
        >
          <Text style={styles.arrow}>📋 View Incidents</Text>
        </Pressable>
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
    
    elevation: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00c9ff',
    textShadowColor: '#0088a9',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius:10,
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
    marginVertical: 10,
    alignItems: 'center',
    width: 220,
  },
  reportButton: {
    backgroundColor: '#28a745',

  },
  viewButton: {
    backgroundColor: '#007bff',
  },
  arrow:{
    color: 'white',
    
  },
  
});
