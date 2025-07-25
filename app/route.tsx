import React, { useState, useRef } from 'react';
import {
  View,
  Button,
  StyleSheet,
  Alert,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, Region, Circle } from 'react-native-maps';
import polyline from '@mapbox/polyline';
import * as Location from 'expo-location';
import { EXPO_PUBLIC_ORS_API_KEY } from '@env';

const geocodeAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://api.openrouteservice.org/geocode/search?api_key=${EXPO_PUBLIC_ORS_API_KEY}&text=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (
      data.features &&
      data.features.length > 0 &&
      data.features[0].geometry &&
      data.features[0].geometry.coordinates
    ) {
      const [lng, lat] = data.features[0].geometry.coordinates;
      return { latitude: lat, longitude: lng };
    } else {
      throw new Error('No results found');
    }
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

type LocationCoords = {
  latitude: number;
  longitude: number;
};

export default function RoutePlannerScreen() {
  const [region, setRegion] = useState<Region>({
    latitude: 10.5,
    longitude: 76.2,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  });

  const [startLoc, setStartLoc] = useState<LocationCoords | null>(null);
  const [endLoc, setEndLoc] = useState<LocationCoords | null>(null);
  const [routeCoords, setRouteCoords] = useState<LocationCoords[]>([]);
  const [startText, setStartText] = useState('');
  const [endText, setEndText] = useState('');

  const mapRef = useRef<MapView>(null);

  const disasterZones = [
    { latitude: 10.52, longitude: 76.21, radius: 1000, color: 'rgba(255,0,0,0.4)' },   // Red
    { latitude: 10.54, longitude: 76.25, radius: 800, color: 'rgba(255,165,0,0.4)' },  // Orange
    { latitude: 10.48, longitude: 76.22, radius: 600, color: 'rgba(255,255,0,0.4)' },  // Yellow
    { latitude: 10.56, longitude: 76.26, radius: 900, color: 'rgba(255,0,0,0.4)' },    // Red
    { latitude: 10.49, longitude: 76.23, radius: 700, color: 'rgba(255,165,0,0.4)' },  // Orange
    { latitude: 10.47, longitude: 76.27, radius: 500, color: 'rgba(255,255,0,0.4)' },  // Yellow
    { latitude: 10.50, longitude: 76.28, radius: 1000, color: 'rgba(255,0,0,0.4)' },   // Red
    { latitude: 10.53, longitude: 76.29, radius: 800, color: 'rgba(255,165,0,0.4)' },  // Orange
  ];

  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Location permission is required.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    const current = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
    setStartLoc(current);
    setRegion({ ...region, ...current });
  };

  const isRouteSafe = (route: LocationCoords[]) => {
    const redZones = disasterZones.filter((zone) => zone.color.includes('255,0,0'));
    return !route.some((point) =>
      redZones.some((zone) => {
        const dx = point.latitude - zone.latitude;
        const dy = point.longitude - zone.longitude;
        const distance = Math.sqrt(dx * dx + dy * dy) * 111000; // approx meters
        return distance <= zone.radius;
      })
    );
  };

  const getRouteFromORS = async (start: LocationCoords, end: LocationCoords) => {
    let attempts = 0;
    const maxAttempts = 5;
    let adjustedStart = { ...start };
    let adjustedEnd = { ...end };
  
    while (attempts < maxAttempts) {
      try {
        const response = await fetch('https://api.openrouteservice.org/v2/directions/driving-car', {
          method: 'POST',
          headers: {
            Authorization: EXPO_PUBLIC_ORS_API_KEY,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            coordinates: [
              [adjustedStart.longitude, adjustedStart.latitude],
              [adjustedEnd.longitude, adjustedEnd.latitude],
            ],
          }),
        });
  
        const data = await response.json();
  
        if (!data?.routes || !Array.isArray(data.routes)) {
          console.error('Invalid ORS response:', data);
          Alert.alert('Route Error', 'Route could not be calculated.');
          return;
        }
  
        const decoded = polyline.decode(data.routes[0].geometry);
        const coords = decoded.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));
  
        if (!isRouteSafe(coords)) {
          // Shift slightly and retry
          adjustedStart.latitude += 0.002 * (Math.random() - 0.5);
          adjustedStart.longitude += 0.002 * (Math.random() - 0.5);
          adjustedEnd.latitude += 0.002 * (Math.random() - 0.5);
          adjustedEnd.longitude += 0.002 * (Math.random() - 0.5);
          attempts++;
        } else {
          setRouteCoords(coords);
          return;
        }
      } catch (error) {
        console.error('ORS routing error:', error);
        Alert.alert('API Error', 'Failed to fetch route.');
        return;
      }
    }
  
    Alert.alert(
      'Safe Route Not Found',
      'Could not find a safe route avoiding red zones. Please try different locations.'
    );
    setRouteCoords([]);
  };
  
  const handleGetRoute = async () => {
    let start = startLoc;
    let end = endLoc;

    if (!start && startText) start = await geocodeAddress(startText);
    if (!end && endText) end = await geocodeAddress(endText);

    if (start && end) {
      setStartLoc(start);
      setEndLoc(end);
      getRouteFromORS(start, end);
    } else {
      Alert.alert('Error', 'Please provide valid start and end locations.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.controls}>
        <TextInput
          placeholder="Start location"
          value={startText}
          onChangeText={setStartText}
          style={styles.input}
        />
        <TextInput
          placeholder="End location"
          value={endText}
          onChangeText={setEndText}
          style={styles.input}
        />
        <Button title="Use Current Location" onPress={getCurrentLocation} />
        <Button title="Get Safe Route" onPress={handleGetRoute} />
      </View>

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={region}
        showsUserLocation
        showsMyLocationButton
      >
        {startLoc && <Marker coordinate={startLoc} title="Start" />}
        {endLoc && <Marker coordinate={endLoc} title="End" />}

        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="black" strokeWidth={4} />
        )}

        {disasterZones.map((zone, idx) => (
          <Circle
            key={idx}
            center={{ latitude: zone.latitude, longitude: zone.longitude }}
            radius={zone.radius}
            fillColor={zone.color}
            strokeColor="transparent"
          />
        ))}
      </MapView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  controls: {
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  map: {
    flex: 1,
  },
});
