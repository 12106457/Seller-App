import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Version = () => {
  return (
    <>
        <Stack.Screen options={{headerTitle:"Version"}} />
        <View style={styles.container}>
          <Text style={{fontSize:18}}>Version: 1.0.1</Text>
        </View>
    </>
  )
}

export default Version

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    
    }
})