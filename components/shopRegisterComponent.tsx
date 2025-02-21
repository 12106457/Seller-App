import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MultiSelect } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";
import { MasterDataItem } from "@/models/common";
import AsyncStorage from '@react-native-async-storage/async-storage';

const data = [
  { label: "Apple", value: 1 },
  { label: "Banana", value: 2 },
  { label: "Orange", value: 3 },
  { label: "Grapes", value: 4 },
  { label: "Mango", value: 5 },
];

interface formDataType {
  name: string;
  shopAddress: string;
  location: string;
  shopImage: string;
  openingHours: string;
  shopCategory?:string[]
}

interface propType {
  onSave: (data: formDataType) => void;
}

const UserProfileComponent = ({ onSave }: propType) => {
  const [formData, setFormData] = useState<formDataType>({
    name: "",
    shopAddress: "",
    location: "",
    shopImage: "",
    openingHours: "",
  });
  const [formDataError,setFormDataError]=useState({
    name: false,
    shopAddress: false,
    location: false,
    // shopImage: false,
    openingHours: false,
    shopCategory:false
  })
  const [shopCategory,setShopCategory]=useState<MasterDataItem[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const handleChange = ({ text, field }: { text: string; field: string }) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const categoryList = await getData("shopCategory");
      if (categoryList) {
        setShopCategory(categoryList);
      }
    };

    fetchCategory();
  }, []);

  const getData = async (key:any) => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error("Error in getting data from localstorage");
    }
  }

  // const fetchShopCategory = () => {

  //   fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/master/get`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //   })
  //     .then((response) => {

  //       if (!response.ok) {
  //         return response.text().then((errorText) => {
  //           console.error("Server Error:", errorText);
  //           throw new Error("Something went wrong");
  //         });
  //       }

  //       return response.json();
  //     })
  //     .then((data) => {
  //       if (data.status) {
  //       setShopCategory(data.data);
  //       } else {
  //         Alert.alert(data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Error Fetching Data:", error.message);
  //       Alert.alert("Something Went Wrong During API Calling");
  //     });
  // };

  const handleSubmit = () => {
    // Check if any field is empty
    const errors = {
      name: formData.name.trim() === "",
      shopAddress: formData.shopAddress.trim() === "",
      location: formData.location.trim() === "",
      // shopImage: !formData.shopImage, // Assuming it's a file or URL
      openingHours: formData.openingHours.trim() === "",
      shopCategory: selectedCategory.length === 0, // Assuming it's an array
    };
  
    // Update error state
    setFormDataError(errors);
  
    // If any field has an error, stop execution
    if (Object.values(errors).includes(true)) return;
  
    // If no errors, proceed with submission
    const data = {
      name: formData.name,
      shopAddress: formData.shopAddress,
      location: formData.location,
      shopImage: formData.shopImage,
      openingHours: formData.openingHours,
      shopCategory: selectedCategory,
    };
  
    onSave(data);
  };
  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.inputContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={{
                  uri: "https://cdni.iconscout.com/illustration/premium/thumb/cashier-at-register-illustration-download-in-svg-png-gif-file-formats--counter-logo-supermarket-cash-store-shop-market-pack-e-commerce-shopping-illustrations-4632162.png",
                }}
                style={styles.logo}
              />
              <Text style={styles.title}>Shop Register</Text>
            </View>

            <TextInput
             style={[
              styles.input,
              formDataError.name && { borderColor: "red", borderWidth: 1 }
            ]}
              placeholder="Enter Shop Name"
              value={formData.name}
              onChangeText={(text) => handleChange({ text, field: "name" })}
            />

            <MultiSelect
              style={[
                styles.input,
                formDataError.shopCategory && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholderStyle={{ fontSize: 18, color: "#888" }}
              selectedStyle={{
                backgroundColor: Colors.white,
                padding: 5,
                borderRadius: 8,
              }}
              data={shopCategory.map((item) => ({ label: item.name, value: item._id }))}
              labelField="label"
              valueField="value"
              placeholder="Select Shop Categories"
              value={selectedCategory}
              onChange={setSelectedCategory}
            />

            <TextInput
             style={[
              styles.input,
              formDataError.location && { borderColor: "red", borderWidth: 1 }
            ]}
              placeholder="Enter Location"
              value={formData.location}
              onChangeText={(text) => handleChange({ text, field: "location" })}
            />

            <TextInput
              style={[
                styles.input,
                formDataError.shopAddress && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Shop Address"
              value={formData.shopAddress}
              onChangeText={(text) =>
                handleChange({ text, field: "shopAddress" })
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Image Url"
              value={formData.shopImage}
              onChangeText={(text) =>
                handleChange({ text, field: "shopImage" })
              }
            />

            <TextInput
              style={[
                styles.input,
                formDataError.openingHours && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Shop Timings"
              value={formData.openingHours}
              onChangeText={(text) =>
                handleChange({ text, field: "openingHours" })
              }
            />

            <TouchableOpacity style={styles.signInBtn} onPress={handleSubmit}>
              <Text style={styles.signInTxt}>Register</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default UserProfileComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
  },
  logoContainer: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  inputContainer: {
    width: "90%",
    marginTop: 0,
    gap: 15,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderWidth: 1,
    elevation: 5,
    padding: 10,
    marginHorizontal: "auto",
    borderRadius: 10,
  },
  input: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: Colors.bgColor,
    color: Colors.black,
    padding: 15,
    marginTop: 5,
    fontSize: 18,
  },
  signInBtn: {
    width: "100%",
    padding: 15,
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    marginTop: 10,
    marginBottom:10
  },
  signInTxt: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
  },
});
