import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const index = () => {
  return (
    <>
    <Stack.Screen options={{headerTitle:'Notification'}}/>
    <View style={styles.container}>
      <Text style={styles.text}>No notifications</Text>
    </View>
    </>
  )
}

export default index

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:'center'
    },
    text:{
        fontSize:18,
        color:"gray"
    }
})