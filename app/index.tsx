import { BackHandler, Image, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import { useFocusEffect, useRouter } from 'expo-router';
import Login from "./auth/login"
const index = () => {
    const router=useRouter();
    // useEffect(() => {
    //   // Delay navigation until after mounting
    //   setTimeout(() => {
    //     router.replace("/auth/login"); // Use replace to prevent going back
    //   }, 100); 
    // }, []);
    useFocusEffect(
      useCallback(() => {
        const onBackPress = () => {
          BackHandler.exitApp(); // Exit the app instead of going back
          return true; // Prevent default behavior
        };
  
        BackHandler.addEventListener("hardwareBackPress", onBackPress);
  
        return () => {
          BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        };
      }, [])
    );
  return (
    <>
      <Login/>
    </>
  )
}

export default index

const styles = StyleSheet.create({
    container:{
        // flex:1,
        // justifyContent:"flex-start",
        // alignItems:"center",
        // backgroundColor:Colors.bgColor
    },
    
})