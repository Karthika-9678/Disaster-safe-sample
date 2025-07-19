import { Stack } from "expo-router";
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="about" options={{ title: 'About' }} />
      <Stack.Screen name="report" options={{title: 'Report Incident'}} />
      <Stack.Screen name="IncidentListScreen" options={{ title: 'Incident List' }} />
      <Stack.Screen name="view_report" options={{title : 'Dashboard'}} />
    </Stack>
  );
}