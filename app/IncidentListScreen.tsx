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
  userId: string;
  upvotes: number;
  downvotes: number;
};

export default function IncidentListScreen() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const loggedInUserId = '64d3e7f99c1c1c001e6d1235'; // Simulated logged-in user

  const fetchIncidents = async () => {
    try {
      const res = await fetch("http://192.168.43.194:5000/api/incidents");
      const data = await res.json();

      // Sort by most recent date
      data.sort((a: Incident, b: Incident) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      setIncidents(data);
    } catch (err) {
      Alert.alert("Error", "Could not fetch incidents");
    }
  };

  const deleteIncident = async (id: string) => {
    try {
      const res = await fetch(`http://192.168.43.194:5000/api/incidents/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: loggedInUserId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Incident deleted");
        fetchIncidents();
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (err) {
      alert("❌ Error: Could not delete incident");
    }
  };

  const handleVote = async (id: string, voteType: 'upvote' | 'downvote') => {
    Alert.alert(
      "Confirm Vote",
      "Once you vote, it can't be revoted. Be sure before you vote.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Vote",
          onPress: async () => {
            try {
              console.log(`Voting ${voteType} for incident ${id} by user ${loggedInUserId}`);

              const response = await fetch(`http://192.168.43.194:5000/api/incidents/${id}/vote`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: loggedInUserId, voteType }),
              });

              const data = await response.json();
              console.log("Vote response:", data);

              if (response.ok) {
                setIncidents((prevIncidents) =>
                  prevIncidents.map((incident) =>
                    incident._id === id
                      ? {
                          ...incident,
                          upvotes:
                            voteType === "upvote" ? incident.upvotes + 1 : incident.upvotes,
                          downvotes:
                            voteType === "downvote" ? incident.downvotes + 1 : incident.downvotes,
                        }
                      : incident
                  )
                );
              } else {
                Alert.alert("Could not vote", data.message || "Unknown error");
              }
            } catch (error) {
              console.error("Vote error:", error);
              Alert.alert("Could not vote", "Something went wrong.");
            }
          },
        },
      ]
    );
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const getSeverityStyle = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return styles.severityHigh;
      case 'medium':
        return styles.severityMedium;
      case 'low':
        return styles.severityLow;
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📋 Reported Incidents</Text>
      <FlatList
        data={incidents}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>📌 {item.incidentType}</Text>
            <Text style={styles.text}>📝 {item.description}</Text>
            <Text style={styles.text}>📍 {item.location.coordinates.join(', ')}</Text>
            <Text style={[styles.text, getSeverityStyle(item.severity)]}>
              📊 {item.severity}
            </Text>
            <Text style={styles.text}>🕒 {new Date(item.date).toLocaleString()}</Text>
            <Text style={styles.text}>👤 User ID: {item.userId}</Text>

            {item.userId === loggedInUserId ? (
              <Pressable
                style={styles.deleteButton}
                onPress={() => deleteIncident(item._id)}
              >
                <Text style={styles.deleteText}>🗑 Delete</Text>
              </Pressable>
            ) : (
              <View style={styles.voteContainer}>
                <Pressable
                  style={styles.voteButton}
                  onPress={() => handleVote(item._id, 'upvote')}
                >
                  <Text>👍 {item.upvotes || 0}</Text>
                </Pressable>
                <Pressable
                  style={styles.voteButton}
                  onPress={() => handleVote(item._id, 'downvote')}
                >
                  <Text>👎 {item.downvotes || 0}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#0f172a',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#d1d3d8ff'
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    marginBottom: 6,
    color: '#e5eaf3ff',
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ff4d4d',
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
  voteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  voteButton: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
  },
  severityHigh: {
    color: 'red',
    fontWeight: 'bold',
  },
  severityMedium: {
    color: 'orange',
    fontWeight: 'bold',
  },
  severityLow: {
    color: 'green',
    fontWeight: 'bold',
  },
});
