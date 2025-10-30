import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { notificationData, notificationResponse } from '@/models/common'
import ToastManager, { Toast } from 'toastify-react-native'
import { ProfileContext } from '@/context/profileContext'

const index = () => {
  const { profileData, ShopDetails } = useContext(ProfileContext);
  const [notificationData,setNotificationData]=useState<notificationData[]|undefined>([])
    useEffect(()=>{
      FetchDashboardData();
    },[])
    const FetchDashboardData = () => {
        // setLoading(true);
          fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/notifications/${ShopDetails?._id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => {
              
              return response.json();
            })
            .then((data:notificationResponse) => {
              if (data.status) {
                setNotificationData(data.data);
                console.log("data");
                // setLoading(false);
              } else {
                Toast.error(data.message);
              }
            })
            .catch((error) => {
              console.error("Error Fetching Data:", error.message);
              Toast.error("Something went wrong")
            });
            
        };
  return (
    <>
     <ToastManager/>
    <Stack.Screen options={{headerTitle:'Notification'}}/>
    <View style={styles.container}>
      {notificationData?.length===0&&<Text style={styles.text}>No notifications</Text>}
      {
        notificationData && notificationData?.length>0 && notificationData.map((item)=>
          <View>
          <Text>{item.title}</Text>
        </View>
        )
      }
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