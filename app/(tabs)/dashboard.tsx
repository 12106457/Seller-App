import {
  View,
  StatusBar,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated
} from "react-native";
import { Tabs, useRouter } from "expo-router";
import { FontAwesome, FontAwesome6, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ProfileContext } from "@/context/profileContext";
import { LinearGradient } from 'expo-linear-gradient';
import { dashboardData, dashboardResponse } from "@/models/common";
import ToastManager, { Toast } from "toastify-react-native";
import { Image } from 'expo-image'
import { useFocusEffect } from "@react-navigation/native";

// Inside your dashboard screen component
const orderStatusMap: Record<string, keyof dashboardData> = {
  Pending: "pendingOrders",
  "In Process": "processedOrders",
  Delivered: "deliveredOrders",
  Cancelled: "cancelledOrders",
};
const Dashboard = () => {
  const { profileData, ShopDetails } = useContext(ProfileContext);
  const [dashboardData,setDashboardData]=useState<dashboardData>();
  const [orderDetailsOpen,setOrderDetailsOpen]=useState(false);
  const route = useRouter();
  const fadeAnims = useRef(["Pending", "In Process", "Delivered", "Cancelled"].map(() => new Animated.Value(0))).current;

useEffect(() => {
  if (orderDetailsOpen) {
    fadeAnims.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: 1,
        duration: 500,
        delay: index * 200, // Staggered animation (0ms, 300ms, 600ms, etc.)
        useNativeDriver: true,
      }).start();
    });
  } else {
    fadeAnims.forEach((anim) => {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    });
  }
}, [orderDetailsOpen]);
useFocusEffect(
  useCallback(() => {
    FetchDashboardData(); // Fetch data every time screen is focused

    return () => {
      // Optional cleanup if needed
      setOrderDetailsOpen(false);
    };
  }, [])
);
  const FetchDashboardData = () => {
      // setLoading(true);
        fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/dashboard/${ShopDetails?._id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => {
            
            return response.json();
          })
          .then((data:dashboardResponse) => {
            if (data.status) {
              setDashboardData(data.data);
              console.log("data:",data);
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ToastManager/>
      <StatusBar
        backgroundColor={Colors.primaryColor}
        barStyle="light-content"
      />

      {/* 40% height colored section */}
      <View style={styles.primaryContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleTxt}>Hello {profileData?.firstname} !</Text>
          <TouchableOpacity
            style={styles.logo}
            onPress={() => route.push("/(tabs)/setting")}
          >
            {
              ShopDetails?.shopImage===""?
              (<FontAwesome name="user-circle-o" size={40} color="black" />):
              (<Image source={{uri:ShopDetails?.shopImage}}resizeMode="cover" style={{width:40,height:40,borderRadius:100}}/>)
            }
            {/* <FontAwesome name="photo" size={28} color="black" /> */}
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.saleContainer}>
            <Text style={styles.saleTitle}>Today Sale</Text>
            <Text style={styles.saleAmount}>₹ {dashboardData?.todayCollection.toFixed(2)}</Text>
          </View>

          <View style={styles.saleContainer}>
            <Text style={styles.saleTitle}>Yesterday Sale</Text>
            <Text style={styles.saleAmount}>₹ {dashboardData?.yesterdayCollection.toFixed(2)}</Text>
          </View>
        </View>
      </View>

      {/* 60% height content section */}
      <ScrollView style={styles.secordaryContainer}>
        <View style={styles.infoContainer}>
            <TouchableOpacity style={styles.infoBox}>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:10}}>
                  <Text style={styles.infoTxt}>Products</Text>
                  <Image
                source={require('../../assets/gif/boxes.gif')} 
                style={styles.gifIcon}
                contentFit="contain"
                />
                </View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",paddingHorizontal:20}}>
                      <Text style={styles.infoValue}>{dashboardData?.productCount}</Text>
                      {/* <FontAwesome6 name="arrow-right-long" size={24} color="white" /> */}
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBox}>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:10}}>
                  <Text style={styles.infoTxt}>Rating</Text>
                  <Image
                source={require('../../assets/gif/banners.gif')} 
                style={styles.gifIcon}
                contentFit="contain"
                />
                </View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",paddingHorizontal:20}}>
                      <Text style={styles.infoValue}>{ShopDetails?.rating.toFixed(1)}</Text>
                      {/* <FontAwesome6 name="arrow-right-long" size={24} color="white" /> */}
                </View>
            </TouchableOpacity>
            
        </View>

        <View style={[styles.infoContainer,{marginTop:30}]}>
        <TouchableOpacity style={styles.infoBox} onPress={()=>setOrderDetailsOpen(!orderDetailsOpen)}>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:10}}>
                  <Text style={[styles.infoTxt,{width:70}]}>Total Orders</Text>
                  <Image
                source={require('../../assets/gif/task.gif')} 
                style={styles.gifIcon}
                contentFit="contain"
                />
                </View>
                <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",paddingHorizontal:20}}>
                      <Text style={styles.infoValue}>{dashboardData?.totalMonthlyOrders}</Text>
                      <FontAwesome6 name="arrow-right-long" size={24} color="white" />
                </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoBox}>
                <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center", padding:10}}>
                  <Text style={[styles.infoTxt,{width:70}]}>Month Sales</Text>
                  <Image
                source={require('../../assets/gif/rupee.gif')} 
                style={styles.gifIcon}
                contentFit="contain"
                />
                </View>
                <View style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"center",paddingHorizontal:5}}>
                      <Text style={[styles.infoValue,{fontSize:24,marginTop:10,textAlign:"center",flex:1}]}>{dashboardData?.totalMonthlyAmount.toFixed(1)}</Text>
                      {/* <FontAwesome6 name="arrow-right-long" size={24} color="white" /> */}
                </View>
            </TouchableOpacity>
            
            
        </View>
        {orderDetailsOpen && (
      <View style={[styles.infoContainer,{marginTop:20}]}>
        {["Pending", "In Process", "Delivered", "Cancelled"].map((status, index) => (
          <Animated.View key={status} style={[styles.orderBox, { opacity: fadeAnims[index] }]}>
            <Text style={styles.orderBoxText}>{status}</Text>
            <View style={styles.orderBoxDataContainer}>
            <Text style={styles.orderBoxData}>
              {dashboardData?.[orderStatusMap[status]]}
            </Text>
            </View>
          </Animated.View>
        ))}
      </View>
    )}
        
        
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  primaryContainer: {
    height: "40%",
    backgroundColor: Colors.primaryColor,
    borderBottomLeftRadius: 70,
  },
  secordaryContainer: {
    flex: 1,
    padding: 20,
    backgroundColor:Colors.bgColor
  },
  titleContainer: {
    width: "100%",
    paddingHorizontal: 40,
    paddingVertical: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleTxt: {
    color: "white",
    fontSize: 32,
    fontWeight: "800",
  },
  logo: {
    width: 45,
    height: 45,
    backgroundColor: "white",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 0.9,
  },
  saleContainer: {
    gap: 5,
  },
  saleTitle: {
    fontSize: 17,
    color: "white",
    fontWeight: "500",
  },
  saleAmount: {
    fontSize: 30,
    color: "white",
    fontWeight: "800",
  },
  infoContainer:{
    width:"100%",
    paddingHorizontal:20,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:'center'
  },
  infoBox:{
    width:"45%",
    height:130,
    backgroundColor:"#324dba",
    borderRadius:10
  },
  infoIcon:{
    width:46,
    height:46,
    backgroundColor:"white",
    justifyContent:"center",
    alignItems:"center",
    borderRadius:50,
    marginLeft:20,
    marginTop:10
  },
  infoTxt:{
    color:"white",
    fontSize:18,
    fontWeight:"800"
  },
  infoValue:{
    fontSize:36,
    color:"white",
    fontWeight:"700"
  },
  button: {
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
  },
  text: {
    backgroundColor: 'transparent',
    fontSize: 15,
    color: '#fff',
  },
  gifIcon:{
    width:40,
    height:40,
    borderRadius:10,

  },
  orderBox:{
    width:70,
    height:70,
    backgroundColor:"orange",
    borderRadius:10
  },
  orderBoxText:{
    textAlign:"center",
    fontSize:12.5,
    padding:4,
    fontWeight:"700",
    color:"white",
    borderBottomWidth:2,
    borderBottomColor:"white"
  },
  orderBoxDataContainer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center"
  },
  orderBoxData:{
    fontSize:24,
    color:"white",
    fontWeight:'700'
  }
});
