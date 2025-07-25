import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '@/components/Button';
import MapView from 'react-native-maps';
import * as Location from 'expo-location'; // For getting device location
import axios from 'axios';                 // For sending request to backend
import { Alert, Linking } from 'react-native'; // For popup and auto-dial


export default function AboutScreen() {

  const router = useRouter();

   // ✅ Emergency Button Handler Function
  const handleEmergency = async () => {
    Alert.alert(
      "🚨 Emergency Alert",
      "Do you want to contact the nearest police station?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              // 1. Ask for location permission
              const { status } = await Location.requestForegroundPermissionsAsync();
              if (status !== 'granted') {
                Alert.alert("Permission Denied", "Location access is required.");
                return;
              }

              // 2. Get user location
              const location = await Location.getCurrentPositionAsync({});
              const { latitude, longitude } = location.coords;

              // 3. Send to backend and get nearest station
              const response = await axios.post('http://<YOUR_BACKEND_IP>:5000/api/police/nearest', {
                latitude,
                longitude
              });

              // 4. Get contact and dial
              const phone = response.data.contact;
              Linking.openURL(`tel:${phone}`);

            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Could not reach emergency services.");
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>🚨 Emergency Panel</Text>
      <Text style={styles.subheading}>Access quick actions for safety</Text>

      <ScrollView contentContainerStyle={styles.footerContainer}>
        <Button label="📍 SEE MAP" onPress={() => router.push('/mapview')}/>
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
  map: {
    width: '100%',
    height: 300,
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
  }
});
