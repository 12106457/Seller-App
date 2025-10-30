import React, { useState, useRef, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import Colors from "@/constants/Colors";
import { useSpinner } from "@/context/spinnerContext";
import ToastManager, { Toast } from "toastify-react-native";
import { ProfileContext } from "@/context/profileContext";
import { OrderItemData } from "@/models/common";
import { dateConverter,CustamDateConverter } from "@/utility/getTheDate";
import { TimeConverter } from "@/utility/getTheTime";
import playNotificationSound from "@/components/playNotificationSound";
import { AntDesign, FontAwesome5 } from "@expo/vector-icons";
import OrderDetailsModal from "@/components/orderItemModel";

const todayStatuses = [
  "Pending",
  "Processed",
  "Shipped",
  "Delivered",
  "Cancelled",
];
const pastStatuses = [
  "All",
  "Pending",
  "Processed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const getStatusImage = (status: any) => {
  switch (status) {
    case "pending":
      return require("../../assets/orderIcons/pending.png"); // Adjust path as needed
    case "Processed":
      return require("../../assets/orderIcons/processing.png");
    case "Shipped":
      return require("../../assets/orderIcons/shipped.png");
    case "Delivered":
      return require("../../assets/orderIcons/delivered.png");
    case "Cancelled":
      return require("../../assets/orderIcons/cancelled.png");
    default:
      return require("../../assets/orderIcons/pending.png");
  }
};

function getStatusColor(status: any) {
  let color;
  switch (status) {
    case "Pending":
      color = "rgb(255, 204, 0)"; // Yellow
      break;
    case "Processed":
      color = "rgb(255, 165, 0)"; // Orange
      break;
    case "Shipped":
      color = "rgb(0, 122, 255)"; // Blue
      break;
    case "Delivered":
      color = "rgb(0, 200, 83)"; // Green
      break;
    case "Cancelled":
      color = "rgb(255, 61, 61)"; // Red
      break;
    case "TakeAWay":
      color = "rgb(153, 102, 255)"; // Red
      break;
    default:
      color = "rgb(255, 255, 255)"; // Default to white if status is unknown
  }
  return color;
}

const SlidingButton = () => {
  const [isOnline, setIsOnline] = useState(false);
  const animation = useRef(new Animated.Value(0)).current;
  const [selectedTab, setSelectedTab] = useState("Today");
  const [selectedStatus, setSelectedStatus] = useState(todayStatuses[0]);
  const { setLoading } = useSpinner();
  const { ShopDetails } = useContext(ProfileContext);
  const [orders, setOrders] = useState<OrderItemData[]>([]);
  const [allOrders,setAllOrders]=useState<OrderItemData[]>([])
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [modelVisible,setModelVisible]=useState(false);
  const [orderItemData,setOrderItemData]=useState<OrderItemData>();

  useEffect(() => {
    // console.log("orders:", orders);
  }, [orders]);

  // useEffect(() => {
  //   return () => {
  //     disconnectWebSocket();  // Clean up WebSocket on unmount
  //   };
  // }, []);
  const manuallyDisconnected = useRef(false);
  const connectWebSocket = () => {
    if (socket) return; // Prevent multiple connections

    setLoading(true);
    const url = `wss://${process.env.EXPO_PUBLIC_WEB_SOCKET_URL}${ShopDetails?._id}`;
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log("Connected to WebSocket ✅");
      setLoading(false);
      setIsOnline(true);
      manuallyDisconnected.current = false;
      Toast.success("Online");

      // Send initial request to fetch orders (if needed)
      ws.send(
        JSON.stringify({ type: "fetch_orders", shopId: ShopDetails?._id })
      );
    };

    ws.onmessage = (event) => {
      // console.log("Received WebSocket message:", event.data);
      if (!event.data) {
        console.error("Received null WebSocket message");
        return;
      }
    
      try {
        const data = JSON.parse(event.data);
        if (data.type === "seller_orders") {
          setOrders(data.orders || []);
          Toast.success("Orders Updated ✅");
        } else if (data.type === "order_received") {
          setOrders((prev) => [data.order, ...prev]);
          playNotificationSound();
        } else if (data.type === "order_update") {
          // console.log("order received:", data);
          setOrders((prev) =>
            prev.map((order) =>
              order._id === data.orderData._id
                ? { ...order, ...data.orderData }
                : order
            )
          );
        }  else if (data.type === "no_orders") {
          Toast.info("No Orders Today")
        }else if (data.type === "error") {
          Toast.error(data.message);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected ❌");
      setSocket(null);
      setIsOnline(false);
      setLoading(false);
      toggleConnection(false);//added newly
      Toast.info("Offline");
      if (!manuallyDisconnected) {
        reconnectWebSocket(); // Try reconnecting
      }
    };

    setSocket(ws);
  };

  const disconnectWebSocket = () => {
    manuallyDisconnected.current = true; 
    if (socket) {
      socket.close();
      setSocket(null);
      // setOrders([]); // Clear orders when disconnected
      Toast.info("Offline");
    }
  };

  function reconnectWebSocket() {
    setTimeout(() => {
        console.log("Reconnecting WebSocket...");
        connectWebSocket();
    }, 5000); // Retry after 5 seconds
}

  const toggleConnection = (value: boolean) => {
    // setIsOnline(value);
    if (value && !socket) {
      connectWebSocket();
    } else {
      disconnectWebSocket();
    }
  };

  useEffect(() => {
    Animated.timing(animation, {
      toValue: isOnline ? 1 : 0,  // Move animation according to state
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isOnline]);

  const toggleSwitch = () => {
    // Animated.timing(animation, {
    //   toValue: isOnline ? 0 : 1,
    //   duration: 300,
    //   useNativeDriver: false,
    // }).start();

    toggleConnection(!isOnline);
  };

  const onlineInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const buttonColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ["#F44336", "#4CAF50"],
  });

  const animatedStyles = {
    transform: [{ translateX: onlineInterpolate }],
    backgroundColor: buttonColor,
  };

  const filteredOrders = (selectedTab === "Today" ? orders : allOrders).filter((order) => {
    if (selectedStatus === "All") {
      return true; // Return all orders
    } else {
      return order.status === selectedStatus; // Filter by selected status
    }
  });
  useEffect(() => {
    if (selectedTab === "Past") {
      fetchAllOrderList();
    }
  }, [selectedTab]);

  const fetchAllOrderList = () => {
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/order/${ShopDetails?._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          // console.log(data);
          setAllOrders(data.data);
          Toast.success(data.message);
        } else {
          Toast.error(data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error.message);
        Toast.error("Something went wrong");
        setLoading(false);
      });
  };

  const updateStatusApi = (status:any,orderNo:any)=>{
    setLoading(true);
    fetch(`https://${process.env.EXPO_PUBLIC_WEB_SOCKET_URL}update-status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify({
        orderNo:orderNo,
        deliveryStatus:status 
      })
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status) {
         if(status==="Processed"){
           Toast.success("Order Accepted");
         }else if(status==="Cancelled"){
          Toast.error("Order Cancelled");
         }
         setModelVisible(false);
        } else {
          Toast.error(data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error.message);
        Toast.error("Something went wrong");
        setLoading(false);
      });
  }

  return (
    <>
      <ToastManager showCloseIcon={false} />
      <Stack.Screen
        options={{
          headerTitle: "Orders",
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity
              onPress={toggleSwitch}
              style={[
                styles.sliderContainer,
                { backgroundColor: isOnline ? "#C8E6C9" : "#FFCDD2" },
              ]}
            >
              <Animated.View style={[styles.sliderButton, animatedStyles]}>
                <View style={styles.touchableArea}>
                  <Text style={styles.buttonText}>
                    {isOnline ? "Accept" : "Reject"}
                  </Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        {/* <Text style={styles.statusText}>Status: {isOnline ? 'Online' : 'Offline'}</Text> */}
        <View style={styles.navBar}>
          <TouchableOpacity
            style={[
              styles.navbarOptions,
              selectedTab === "Today" && styles.activeTab,
            ]}
            onPress={() => {
              setSelectedTab("Today");
              setSelectedStatus(todayStatuses[0]);
            }}
          >
            <Text style={styles.navbarTitle}>Today Order</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navbarOptions,
              selectedTab === "Past" && styles.activeTab,
            ]}
            onPress={() => {
              setSelectedTab("Past");
              setSelectedStatus("All");
            }}
          >
            <Text style={styles.navbarTitle}>All Order</Text>
          </TouchableOpacity>
        </View>

        {/* Scrollable Filter */}
        <View style={styles.filterComponent}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={[styles.filterBar]}
          >
            {(selectedTab === "Today" ? todayStatuses : pastStatuses).map(
              (status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.filterOptions,
                    selectedStatus === status && styles.activeFilter,
                  ]}
                  onPress={() => setSelectedStatus(status)}
                >
                  <Text
                    style={[
                      selectedStatus === status && styles.activeFilterText,
                    ]}
                  >
                    {status}
                  </Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </View>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <>
              <TouchableOpacity style={styles.orderItem} onPress={()=>{
                setModelVisible(true);
                setOrderItemData(item);
              }}>
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRightWidth: 0,
                    borderRightColor: "lightgray",
                    marginRight: 5,
                  }}
                >
                  <Image
                    source={getStatusImage(item.status)}
                    style={{ width: 25, height: 25 }}
                  />
                </View>
                <View
                  style={{
                    flex: 7,
                    height: "100%",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                    gap: 0,
                  }}
                >
                  <Text style={styles.title}>#{item.orderNo}</Text>
                  <Text style={styles.textStyle}>{item.customerId.name}</Text>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                      gap: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: getStatusColor(item.status),
                        borderWidth: 1.5,
                        borderColor: getStatusColor(item.status),
                        fontSize: 14,
                        borderRadius: 20,
                        textAlign: "center",
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        alignSelf: "flex-start",
                      }}
                    >
                      {item.status}
                    </Text>
                    <Text
                      style={{
                        color: getStatusColor("TakeAWay"),
                        borderWidth: 1.5,
                        borderColor: getStatusColor("TakeAWay"),
                        fontSize: 14,
                        borderRadius: 20,
                        textAlign: "center",
                        paddingHorizontal: 5,
                        paddingVertical: 2,
                        alignSelf: "flex-start",
                      }}
                    >
                      Take A Way
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 2,
                    height: "100%",
                    justifyContent: "flex-start",
                    alignItems: "flex-end",
                    marginRight: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      marginTop: 7,
                      fontWeight: "900",
                      color: getStatusColor(item.status),
                    }}
                  >
                    {
                    dateConverter(item.orderDate)===dateConverter(new Date())?
                    TimeConverter(item.orderDate):CustamDateConverter(item.orderDate)}
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginTop: 3,
                      fontWeight: "900",
                      color: "gray",
                    }}
                  >
                    {item.items.length} item (s)
                  </Text>
                  <Text
                    style={{
                      fontSize: 15,
                      marginTop: 3,
                      fontWeight: "900",
                      color:
                        item.status !== "Shipped" && item.status !== "Processed"
                          ? getStatusColor("Delivered")
                          : item.status.toLowerCase() === "delivered"
                          ? getStatusColor("Shipped")
                          : getStatusColor("Processed"),
                    }}
                  >
                    {item.totalOrderAmount.toFixed(2)}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#e3e3e3",
                  }}
                >
                  <FontAwesome5 name="chevron-right" size={24} color="gray" />
                </View>
                
              </TouchableOpacity>
            </>
          )}
          style={styles.orderConatiner}
        />
        {
          modelVisible && <OrderDetailsModal isVisible={modelVisible} onClose={setModelVisible} order={orderItemData} changeStatue={updateStatusApi} />
        }
        
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  sliderContainer: {
    flexDirection: "row",
    width: 130,
    height: 40,
    backgroundColor: "#ebeded",
    borderRadius: 25,
    padding: 2,
    position: "relative",
  },
  sliderButton: {
    position: "absolute",
    width: "50%",
    height: "110%",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  touchableArea: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  statusText: {
    marginTop: 20,
    fontSize: 18,
  },
  navBar: {
    flexDirection: "row",
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    justifyContent: "space-around",
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
  },
  navbarOptions: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  activeTab: {
    borderBottomWidth: 3,
    // borderBottomColor: '#4CAF50',
    borderBottomColor: Colors.primaryColor,
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  filterComponent: {
    width: "100%",
    height: 55,
  },
  filterBar: {
    // width:"100%",
    // height:40,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderColor: "gray",
  },
  filterOptions: {
    height: 38,
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 2,
    borderRadius: 8,
    borderColor: "#ddd",
  },
  activeFilter: {
    // backgroundColor: '#4CAF50',
    backgroundColor: Colors.primaryColor,
  },
  activeFilterText: {
    color: "white",
  },
  orderConatiner: {
    width: "100%",
    paddingHorizontal: 0,
    marginTop: 0,
  },
  orderItem: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 100,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    // marginTop:10,
    // borderWidth:2,
    // borderRadius:5,
    // borderColor:"gray"
  },
  orderText: {
    fontSize: 16,
    fontWeight: "500",
  },
  orderStatus: {
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "700",
    fontSize: 17,
  },
  textStyle: {
    fontSize: 18,
    fontWeight: "400",
    color: "gray",
  },
  subContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 5,
    marginBottom: 5,
  },
});

export default SlidingButton;