import { View, Text } from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { Entypo, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ToastManager,{ Toast } from "toastify-react-native";
export default function _layout() {
  const { top, bottom } = useSafeAreaInsets();
  return (
    <Tabs
      screenOptions={{
        
        tabBarStyle: {
          backgroundColor: Colors.bgColor,
          borderTopWidth: 0,
          height: 60,
          paddingTop: 10,
          paddingBottom: 10 + bottom,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: Colors.black,
        tabBarInactiveTintColor: "#999",
      }}
    >
      {/* <Tabs.Screen
        name="dashboard"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <View
              style={{
                backgroundColor: focused ? Colors.primaryColor : "transparent",
                padding: focused ? 5 : 0,
                borderRadius: 5,
              }}
            >
              <Ionicons name="compass" size={20} color={color} />
            </View>
          ),
        }}
      /> */}
      <Tabs.Screen
        name="dashboard"
        options={{
          headerShown:false,
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="space-dashboard" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="products"
        options={{
          tabBarIcon: ({ color }) => (
            <Entypo name="shop" size={24} color={color} />
          ),
          headerTitle: "Products",
        }}
      />
      {/* <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={24} color={Colors.white} />
          ),
          tabBarItemStyle: {
            backgroundColor: Colors.primaryColor,
            borderRadius: 10,
          },
          headerTitle: "Search",
        
        }}
      /> */}
      <Tabs.Screen
        name="orders"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cart-arrow-up" size={24} color={color} />
          ),
          headerTitle: "Orders",
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
          headerTitle: "Settings",
        }}
      />
      {/* tabBarStyle: { display: 'none' }, // to hide the tab section for particular */}
    </Tabs>
  );
}
