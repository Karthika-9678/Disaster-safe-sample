// screens/RoutePlannerScreen.js
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import MapView, { Marker, Circle, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const disasterZones = [
  { latitude: 10.8505, longitude: 76.2711, radius: 1000 },
  { latitude: 10.8605, longitude: 76.2811, radius: 1500 },
];

const RoutePlannerScreen = () => {
  const [region, setRegion] = useState<{ latitude: number; longitude: number; latitudeDelta: number; longitudeDelta: number; } | null>(null);
  const [startLoc, setStartLoc] = useState<Location | null>(null);
  const [endLoc, setEndLoc] = useState<Location | null>(null);
  const [routeCoords, setRouteCoords] = useState([]);
  const mapRef = useRef(null);

const ORS_API_KEY = process.env.EXPO_PUBLIC_ORS_API_KEY;

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
      setStartLoc({ latitude, longitude });
    })();
  }, []);

  const handleLocationSelect = (details: { geometry: { location: { lat: number; lng: number } } }, type: 'start' | 'end') => {
    const lat = details.geometry.location.lat;
    const lng = details.geometry.location.lng;
    const loc = { latitude: lat, longitude: lng };
    type === 'start' ? setStartLoc(loc) : setEndLoc(loc);
  };

  interface Location {
    latitude: number;
    longitude: number;
  }

  const getRouteFromORS = async (start: Location, end: Location) => {
    try {
      if (!ORS_API_KEY) {
        throw new Error('API key is not configured');
      }
      const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${ORS_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          coordinates: [
            [start.longitude, start.latitude],
            [end.longitude, end.latitude]
          ]
        })
      });

      const data = await response.json();
      const coords = data.features[0].geometry.coordinates.map(([lng, lat]: [number, number]) => ({
        latitude: lat,
        longitude: lng
      }));

      setRouteCoords(coords);
    } catch (error) {
      console.error("ORS routing error:", error);
    }
  };

  useEffect(() => {
    if (startLoc && endLoc) {
      getRouteFromORS(startLoc, endLoc);
    }
  }, [startLoc, endLoc]);

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
        >
          {startLoc && <Marker coordinate={startLoc} title="Start" />}
          {endLoc && <Marker coordinate={endLoc} title="Destination" />}

          {/* Real route from ORS */}
          {routeCoords.length > 0 && (
            <Polyline
              coordinates={routeCoords}
              strokeColor="#000"
              strokeWidth={4}
            />
          )}

          {/* Disaster Zones */}
          {disasterZones.map((zone, index) => (
            <Circle
              key={index}
              center={{ latitude: zone.latitude, longitude: zone.longitude }}
              radius={zone.radius}
              fillColor="rgba(255,0,0,0.3)"
              strokeColor="red"
            />
          ))}
        </MapView>
      )}

      {/* Location Inputs */}
      <View style={styles.searchBox}>
        <GooglePlacesAutocomplete
          placeholder="Start location"
          onPress={(data, details) => {
            if (details) handleLocationSelect(details, 'start')
          }}
          fetchDetails={true}
          styles={{ textInput: styles.input }}
          query={{
            key: ORS_API_KEY, // Replace with Google API if needed
            language: 'en',
          }}
        />

        <GooglePlacesAutocomplete
          placeholder="Destination"
          onPress={(data, details) => {
            if (details) handleLocationSelect(details, 'end')
          }}
          fetchDetails={true}
          styles={{ textInput: styles.input }}
          query={{
            key: ORS_API_KEY, // Replace with Google API if needed
            language: 'en',
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: {
    flex: 1,
  },
  searchBox: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 30,
    width: '100%',
  },
  input: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
});

export default RoutePlannerScreen;
