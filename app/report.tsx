import { useState, useEffect } from 'react';
import {
  Text, View, StyleSheet, TextInput, Pressable,
  Image, Switch, Platform, ScrollView, Alert
} from 'react-native';
import { Button } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function ReportIncidentScreen() {
  const [incidentType, setIncidentType] = useState('Tree Fallen');
  const [description, setDescription] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [location, setLocation] = useState<string>('Fetching location...');
  const [image, setImage] = useState<string | null>(null);
  const [severity, setSeverity] = useState<'Low' | 'Medium' | 'High'>('Low');
  const [date, setDate] = useState(new Date());
  const [showDate, setShowDate] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Permission denied');
        return;
      }

      try {
        let loc = await Location.getCurrentPositionAsync({});
        const lat = loc.coords.latitude.toFixed(3);
        const lng = loc.coords.longitude.toFixed(3);
        setLocation(`Lat: ${lat}, Lon: ${lng}`);
        console.log("Location fetched:", `Lat: ${lat}, Lon: ${lng}`);
      } catch (error) {
        setLocation('Error fetching location');
      }
    })();
  }, []);

  const pickImage = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });
    if (!res.canceled) {
      setImage(res.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    console.log("Submitting report with location:", location);

    if (
      location === 'Fetching location...' ||
      location === 'Permission denied' ||
      location === 'Error fetching location'
    ) {
      alert('❌ Cannot submit. Please enable location services or wait for GPS to load.');
      return;
    }
    const latLngMatch = location.match(/Lat: ([\d.-]+), Lon: ([\d.-]+)/);
    if (!latLngMatch) {
      alert('❌ Invalid location format: ' + location);
      return;
    }
    const lat = parseFloat(latLngMatch[1]);
    const lng = parseFloat(latLngMatch[2]);
    try {
      const response = await fetch('http://192.168.43.194:5000/api/incidents', { // replace with your local IP
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: '64d3e7f99c1c1c001e6d1234',
          incidentType,
          description,
          location: {
            lat,
            lng,
          },
          date: date.toISOString(),
          severity,
          isAnonymous,
          imageUri: image
        }),
      });
      alert("here");
      if (response.ok) {
        alert('✅ Incident reported successfully!');
      } else {
        const errorData = await response.json();
        console.log("Backend error:", errorData);
        alert('❌ Error: Failed to submit report');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        Alert.alert('❌ Error', error.message);
      } else {
        Alert.alert('❌ Error', 'Unknown error occurred');
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.outerContainer} keyboardShouldPersistTaps="handled">
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>📢 Report an Incident</Text>

        <Text style={styles.label}>Incident Type:</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={incidentType}
            onValueChange={(val) => setIncidentType(val)}
            style={styles.picker}
          >
            <Picker.Item label="🌳 Tree Fallen" value="Tree Fallen" />
            <Picker.Item label="⚡ Electric Post Down" value="Electric Post Down" />
            <Picker.Item label="🏠 Building Collapse" value="Building Collapse" />
            <Picker.Item label="🔥 Fire" value="Fire" />
            <Picker.Item label="🚗 Road Accident" value="Road Accident" />
            <Picker.Item label="❓ Other" value="Other" />
          </Picker>
        </View>

        <Text style={styles.label}>📍 Location:</Text>
        <Text style={styles.staticText}>{location}</Text>

        <Text style={styles.label}>🕒 Time of Incident:</Text>
        <Pressable onPress={() => setShowDate(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>{date.toLocaleString()}</Text>
        </Pressable>
        {showDate && (
          <DateTimePicker
            value={date}
            mode="datetime"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(event, selectedDate) => {
              setShowDate(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.label}>💬 Description:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Explain what happened..."
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>📊 Severity:</Text>
        <View style={styles.severityContainer}>
          {['Low', 'Medium', 'High'].map((level) => (
            <Pressable
              key={level}
              style={[
                styles.severityButton,
                severity === level && styles.selectedSeverity
              ]}
              onPress={() => setSeverity(level as 'Low' | 'Medium' | 'High')}
            >
              <Text style={styles.severityText}>{level}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>📸 Upload Photo / Video:</Text>
        <Pressable onPress={pickImage} style={styles.imageButton}>
          <Text style={styles.imageText}>Choose from Gallery</Text>
        </Pressable>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}

        <View style={styles.switchRow}>
          <Text style={styles.label}>Report Anonymously</Text>
          <Switch
            value={isAnonymous}
            onValueChange={setIsAnonymous}
            thumbColor={isAnonymous ? '#00c9ff' : '#ccc'}
          />
        </View>

        <Button title="Submit Report" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flexGrow: 1,
    backgroundColor: '#0f2027',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: '#203a43',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#00c9ff',
    
    width: '100%',
  },
  heading: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#bcced3ff',
    textAlign: 'center',
    
    marginBottom: 20,
  },
  label: {
    color: '#cfd8dc',
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  staticText: {
    color: '#fff',
    marginBottom: 15,
  },
  textInput: {
    backgroundColor: '#25405bff',
    color: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    minHeight: 60,
  },
  pickerContainer: {
    backgroundColor: '#2c3e50',
    borderRadius: 8,
    marginBottom: 15,
  },
  picker: {
    color: '#00c9ff',
  },
  dateButton: {
    backgroundColor: '#2c3e50',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: {
    color: '#fff',
  },
  severityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  severityButton: {
    backgroundColor: '#546e7a',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  selectedSeverity: {
    backgroundColor: '#00c9ff',
  },
  severityText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  imageButton: {
    backgroundColor: '#37474f',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  imageText: {
    color: '#00c9ff',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#00c9ff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitLabel: {
    color: '#0f2027',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

