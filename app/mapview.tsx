import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Button, Platform, PermissionsAndroid, Alert } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import * as Location from 'expo-location';

const disasterZones = [
    { id:'1',lat: 10.52, lng: 76.21, radius: 1000, color: 'rgba(255,0,0,0.4)',severity:'red' },   // Red
    { id:'2',lat: 10.54, lng: 76.25, radius: 800, color: 'rgba(255,165,0,0.4)',severity:'orange' },  // Orange
    { id:'3',lat: 10.48, lng: 76.22, radius: 600, color: 'rgba(255,255,0,0.4)',severity:'yellow'},  // Yellow
    { id:'4',lat: 10.56, lng: 76.26, radius: 900, color: 'rgba(255,0,0,0.4)',severity:'red' },    // Red
    { id:'5',lat: 10.49, lng: 76.23, radius: 700, color: 'rgba(255,165,0,0.4)' ,severity:'orange'},  // Orange
    { id:'6',lat: 10.47, lng: 76.27, radius: 500, color: 'rgba(255,255,0,0.4)',severity:'yellow' },  // Yellow
    { id:'7',lat: 10.50, lng: 76.28, radius: 1000, color: 'rgba(255,0,0,0.4)',severity:'red' },   // Red
    { id:'8',lat: 10.53, lng: 76.29, radius: 800, color: 'rgba(255,165,0,0.4)' ,severity:'orange'},  // Orange
  ];

const getRadiusBySeverity = (severity: string) => {
  switch (severity) {
    case 'red':
      return 500;
    case 'orange':
      return 300;
    case 'yellow':
      return 200;
    default:
      return 100;
  }
};

export default function RouteScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);

  const handleGetCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to show your position.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setUserLocation({ latitude, longitude });

      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      });
    } catch (error) {
      console.error('Location Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 10.5001,
          longitude: 76.2501,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02
        }}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="You are here"
            pinColor="blue"
          />
        )}

        {disasterZones.map((zone) => (
          <Circle
            key={zone.id}
            center={{ latitude: zone.lat, longitude: zone.lng }}
            radius={getRadiusBySeverity(zone.severity)}
            strokeColor="transparent"
            fillColor={
              zone.severity === 'red'
                ? 'rgba(255, 0, 0, 0.3)'
                : zone.severity === 'orange'
                ? 'rgba(255, 165, 0, 0.3)'
                : 'rgba(255, 255, 0, 0.3)'
            }
          />
        ))}
      </MapView>

      <View style={styles.buttonContainer}>
        <Button title="Show My Location" onPress={handleGetCurrentLocation} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  buttonContainer: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: 'white',
    padding: 8,
    borderRadius: 8,
    elevation: 5
  }
});
