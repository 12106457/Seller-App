import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { router, Stack, useRouter } from "expo-router";
import { AntDesign, Feather, FontAwesome, FontAwesome5, FontAwesome6, MaterialIcons, Octicons, SimpleLineIcons } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";
import Colors from "@/constants/Colors";
import { ProfileContext } from "@/context/profileContext";
import { ScrollView } from "react-native";
const page = () => {
  const route = useRouter();
  const headerHeight = useHeaderHeight();
 
   const {profileData,ShopDetails}=useContext(ProfileContext);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Profile",
          // headerTitleAlign: "center",
          headerTransparent: true,
          // headerLeft: () => {
          //   return (
          //     <TouchableOpacity
          //       onPress={() => route.back()}
          //       style={styles.headerLeft}
          //     >
          //       <AntDesign name="left" size={18} color="black" />
          //     </TouchableOpacity>
          //   );
          // },
          headerRight: () => {
            return (
              <TouchableOpacity style={styles.headerRight} onPress={()=>router.push("/profileOptions/helpsection")}>
                <FontAwesome5 name="question-circle" size={26} color={Colors.primaryColor} />
                {/* <MaterialIcons name="support-agent" size={24} color="black" /> */}
              </TouchableOpacity>
            );
          },
        }}
      />

      <View style={[styles.container, { marginTop: headerHeight }]}>
        <View style={styles.ProfileContainer}>
          <View style={styles.image}>
           {
            ShopDetails?.shopImage===""?
            ( <FontAwesome name="user-circle-o" size={140} color="black" />):
            (<Image source={{uri:ShopDetails?.shopImage}}resizeMode="cover" style={{width:135,height:135,borderRadius:100,borderWidth:2}}/>)
           }
          </View>

          <Text style={styles.name}>{ShopDetails?.name}</Text>
          <Text style={styles.email}>{profileData?.email}</Text>
          <Text style={styles.email}>{profileData?.phone}</Text>

          {/* Parent container for row layout */}
          <View style={styles.statsContainer}>
            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Total Orders</Text>
              <Text style={styles.statsValue}>360</Text>
            </View>

            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Total Earnings</Text>
              <Text style={styles.statsValue}>238</Text>
            </View>

            <View style={styles.statsItem}>
              <Text style={styles.statsLabel}>Rating</Text>
              <Text style={styles.statsValue}>{ShopDetails?.rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.options}>
          <TouchableOpacity style={styles.optionItem} onPress={()=>route.push("/profileOptions/profile")}>
              <View style={styles.optionLabel}>
                  <AntDesign name="user" size={24} color="black" />
                  <Text style={styles.optionName}>Profile</Text>
              </View>
              <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={()=>route.push("/profileOptions/passwordChangeSection")}>
              <View style={styles.optionLabel}>
                  <MaterialIcons name="published-with-changes" size={24} color="black" />
                  <Text style={styles.optionName}>Change Password</Text>
              </View>
              <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>


          <TouchableOpacity style={styles.optionItem} onPress={()=>route.push("/profileOptions/setting")}>
              <View style={styles.optionLabel}>
                  <AntDesign name="setting" size={24} color="black" />
                  <Text style={styles.optionName}>Settings</Text>
              </View>
              <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={()=>route.push("/auth/login")}>
              <View style={styles.optionLabel}>
              <SimpleLineIcons name="logout" size={24} color="black" />
                  <Text style={styles.optionName}>Logout</Text>
              </View>
              <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.optionItem} onPress={()=>route.push("/profileOptions/Version")}>
              <View style={styles.optionLabel}>
                  <Octicons name="versions" size={24} color="black" />
                  <Text style={styles.optionName}>Version</Text>
              </View>
              <AntDesign name="right" size={18} color="black" />
          </TouchableOpacity>

        </ScrollView>
      </View>
      
    </>
  );
};

export default page;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {
    marginLeft: 10,
    backgroundColor: "#ebeded",
    borderRadius: 30,
    padding: 15,
  },
  headerRight: {
    marginRight: 10,
    backgroundColor: "#ebeded",
    borderRadius: 30,
    padding: 11,
  },
  ProfileContainer: {
    width: "100%",
    height: 300,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // You can add styling here if needed
  },
  name: {
    fontSize: 20,
    fontWeight: "500",
    marginTop: 15,
  },
  email: {
    fontSize: 12,
    color: "gray",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
  },
  // Style for each stat item
  statsItem: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  statsLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  statsValue: {
    fontSize: 18,
    color: Colors.primaryColor,
    fontWeight: "700",
  },
  options:{
    // flex:1,
    padding:20,
    width:"100%",
    marginTop:20
  },
  optionItem:{
    flexDirection:"row",
    justifyContent:"space-between",
    width:"100%",
    alignItems:"center",
    height:60,
    borderBottomWidth:1,
    borderBottomColor:"lightgray"
  },
  optionLabel:{
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
  },
  optionName:{
    fontSize:18,
    fontWeight:"400",
    marginLeft:7
  }
});
