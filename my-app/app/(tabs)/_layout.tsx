import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="customers" 
        options={{
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="(tabs)" 
        options={{
          headerShown: false
        }} 
      />
      <Stack.Screen 
  name="customerdetails" 
  options={{
    headerShown: false
  }} 
/>
    </Stack>
  );
}