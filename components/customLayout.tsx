// app/_layout.js
import { View } from 'react-native';
import { Stack } from 'expo-router';

export default function CustomLayout({ children }:any) {
  return (
    <View style={{ flex: 1 }}>
      <Stack>{children}</Stack>
    </View>
  );
}
