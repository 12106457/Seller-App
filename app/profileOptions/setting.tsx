import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const setting = () => {
  return (
    <>
        <Stack.Screen options={{headerTitle:"Setting"}} />
        <View style={styles.container}>
          <Text style={{fontSize:18}}>Setting</Text>
        </View>
        </>
  )
}

export default setting

const styles = StyleSheet.create({
    container:{
        flex:1,
        justifyContent:"center",
        alignItems:"center",
    
    }
})