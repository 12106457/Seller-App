import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';
const playNotificationSound = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/notificationSound.wav'), // Replace with your actual sound file
        { shouldPlay: true }
      );
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
export default playNotificationSound;