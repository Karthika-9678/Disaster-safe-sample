import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert, StyleSheet } from 'react-native';
type Incident = {
  _id: string;
  incidentType: string;
  description: string;
  location: {
    coordinates: [number, number];
  };
  severity: string;
  date: string;
};

export default function IncidentListScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://192.168.43.194:5000/api/incidents");
      const data = await res.json();
      setIncidents(data);
    } catch (err) {
      Alert.alert("Error", "Could not fetch incidents");
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const res = await fetch(`http://192.168.43.194:5000/api/incidents/${id}`, {
        method: "DELETE"
      });
      const data = await res.json();
      Alert.alert("Deleted", data.message);
      fetchIncidents(); // Refresh
    } catch (err) {
      Alert.alert("Error", "Could not delete incident");
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Reported Incidents</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>📌 {item.incidentType}</Text>
            <Text>📝 {item.description}</Text>
            <Text>📍 {item.location.coordinates.join(', ')}</Text>
            <Text>📊 {item.severity}</Text>
            <Text>🕒 {new Date(item.date).toLocaleString()}</Text>
            <Pressable
              style={styles.deleteButton}
              onPress={() => deleteIncident(item._id)}
            >
              <Text style={styles.deleteText}>🗑 Delete</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  card: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 8 },
  deleteButton: { backgroundColor: '#ff4444', padding: 6, marginTop: 8, borderRadius: 4 },
  deleteText: { color: 'white', textAlign: 'center' }
});
