import { OrderItemData } from "@/models/common";
import { FontAwesome } from "@expo/vector-icons";
import React, { useRef } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, GestureResponderEvent, ScrollView } from "react-native";
import Modal from "react-native-modal";

interface propType {
  isVisible: boolean;
  onClose: (status: boolean) => void;
  order: OrderItemData | undefined;
  changeStatue: (status: any, orderNo: any) => void;
}
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

const OrderDetailsModal = ({ isVisible, onClose, order, changeStatue }: propType) => {
  const scrollOffset = useRef(0);
  

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={() => onClose(false)}
      swipeDirection="down"
      propagateSwipe={true}
      swipeThreshold={200}
      onSwipeComplete={() => onClose(false)}
      scrollTo={(e: GestureResponderEvent) => {}}
      scrollOffset={scrollOffset.current}
      scrollOffsetMax={500} // Prevent modal from closing while scrolling
      style={styles.modalContainer}
    >
      <View style={styles.modalContent}>
        {/* Drag Indicator */}
        <View style={styles.dragIndicatorContainer}>
          <View style={styles.dragIndicator} />
        </View>

        {/* Order Details */}
        {/* <Text style={styles.title}>Order #{order?.orderNo}</Text> */}
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <Text style={styles.title}>Order #{order?.orderNo}</Text>
            <TouchableOpacity>
                <FontAwesome name="th-list" size={24} color="gray" style={{marginRight:10,marginBottom:5}} />
            </TouchableOpacity>
        </View>
        <View style={{flexDirection:"row", justifyContent:"space-between", alignItems:"center"}}>
            <Text style={styles.customerName}>{order?.customerId.name}</Text>
            <Text style={[styles.itemStatus,{color:getStatusColor(order?.status),borderWidth:1,paddingHorizontal:2,borderRadius:10,borderColor:getStatusColor(order?.status)}]}>{order?.status}</Text>
        </View>
        <Text style={styles.address}>
          {order?.customerId?.address?.street}, {order?.customerId?.address?.city},{" "}
          {order?.customerId?.address?.state}, {order?.customerId?.address?.pinCode}
        </Text>

        {/* Order Items - Scrollable List */}
       
          <FlatList
            data={order?.items}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true} // ✅ Allows scrolling inside modal
            keyboardShouldPersistTaps="handled"
            onScroll={(event) => {
              scrollOffset.current = event.nativeEvent.contentOffset.y;
            }}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Image source={{ uri: item?.productId?.prodId?.image }} style={styles.itemImage} />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item?.productId?.name}</Text>
                  <Text style={styles.itemQty}>{item?.productId?.price} x {item?.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>₹{item?.totalAmount.toFixed(2)}</Text>
              </View>
            )}
          />
        

        {/* Total Amount */}
        <Text style={styles.totalAmount}>Total: ₹{order?.totalOrderAmount.toFixed(2)}</Text>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          {
             order?.status==="Pending"&&<TouchableOpacity style={styles.acceptButton} onPress={() => changeStatue("Processed", order?.orderNo)}>
                <Text style={styles.buttonText}>Accept</Text>
             </TouchableOpacity>
          }
          {
             order?.status==="Processed"&&<TouchableOpacity style={styles.readyButton} onPress={() => changeStatue("Shipped", order?.orderNo)}>
                 <Text style={styles.buttonText}>Ready</Text>
             </TouchableOpacity>
          }
          {
            order?.status==="Shipped" &&<TouchableOpacity style={styles.deliveredButton} onPress={() => changeStatue("Delivered", order?.orderNo)}>
                <Text style={styles.buttonText}>Delivered</Text>
            </TouchableOpacity>
          }
          {
            order?.status==="Pending"||order?.status==="Processed"||order?.status==="Shipped" &&<TouchableOpacity style={styles.cancelButton} onPress={() => changeStatue("Cancelled", order?.orderNo)}>
                <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          }
           {
            order?.status==="Cancelled" &&<View style={[styles.cancelButton,{opacity:0.9}]} >
                <Text style={styles.buttonText}>Cancelled</Text>
            </View>
           }
           {
            order?.status==="Delivered" &&<TouchableOpacity style={[styles.deliveredButton,{opacity:0.9}]}>
                <Text style={styles.buttonText}>Delivered</Text>
            </TouchableOpacity>
          }
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    paddingTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: "80%",
  },
  dragIndicatorContainer: {
    width: "100%",
    height: 7,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  dragIndicator: {
    width: 100,
    height: "100%",
    backgroundColor: "lightgray",
    borderRadius: 100,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  address: {
    fontSize: 14,
    color: "gray",
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemStatus:{
    fontSize: 16,
    fontWeight: "bold",
  },
  itemQty: {
    fontSize: 14,
    color: "gray",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "right",
    marginVertical: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "green",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  readyButton: {
    backgroundColor: "rgb(255, 165, 0)",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  deliveredButton: {
    backgroundColor: "rgb(0, 122, 255)",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "red",
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default OrderDetailsModal;
