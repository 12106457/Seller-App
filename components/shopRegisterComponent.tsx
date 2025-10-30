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
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { MultiSelect,Dropdown } from "react-native-element-dropdown";
import Colors from "@/constants/Colors";
import { MasterDataItem } from "@/models/common";
import AsyncStorage from '@react-native-async-storage/async-storage';
import TimePicker from "@/components/timePicker"
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
  // location: string;
  shopImage: string;
  openingHours: string;
  shopCategory?:string[]
}
interface onSaveProps{
  name: string;
  shopAddress: string;
  // location: string;
  shopImage: string;
  openingHours: string;
  shopCategory?: string;
  subCategorys?:string[];
  latitude:number,
  longitude:number,
}

interface propType {
  onSave: (data: onSaveProps) => void;
}

const UserProfileComponent = ({ onSave }: propType) => {
  const [formData, setFormData] = useState({
    name: "",
    shopAddress: "",
    // location: "",
    shopImage: "",
    openingHours: "",
    
  });

  const [formDataError, setFormDataError] = useState({
    name: false,
    shopAddress: false,
    // location: false,
    openingHours: false,
    shopCategory: false,
    subCategory:false,
    
  });
  const [shopCategory,setShopCategory]=useState<MasterDataItem[]>([]);
  const [subCategoryList,setSubCategoryList]=useState<MasterDataItem[]>([]);


  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubCategory,setSelectedSubCategory]=useState<string[]>([]);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean | null>(null);
  const [openTime, setOpenTime] = useState<string | null>(null); // TypeScript type is explicitly string | null
  const [closeTime, setCloseTime] = useState<string | null>(null);

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setHasLocationPermission(false);
        Alert.alert("Permission Denied", "Location access is required to register a shop.");
        return;
      }

      setHasLocationPermission(true);
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    };

    getLocation();
  }, []);

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


  const fetchSubCategory = async (categoryId: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/master/get-subcategory/${categoryId}`
    );
    const data = await response.json();

    if (data.status) {
      setSubCategoryList(data.data);
    } else {
      Alert.alert("Failed to fetch subcategories");
    }
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    Alert.alert("Something went wrong while fetching subcategories");
  }
};

  const handleSubmit = () => {

    console.log("opening hours:",`${openTime}-${closeTime}`);
    if (!hasLocationPermission) {
      Alert.alert("Location Required", "Please grant location access to proceed.");
      return;
    }

    if (!location) {
      Alert.alert("Error", "Unable to get location. Try again.");
      return;
    }

    // Check if any field is empty
    const errors = {
      name: formData.name.trim() === "",
      shopAddress: formData.shopAddress.trim() === "",
      // location: formData.location.trim() === "",
      shopCategory: selectedCategory==="",
      subCategory:selectedSubCategory.length===0,
      openingHours:openTime===null||closeTime===null,
      
    };

    setFormDataError(errors);
    if (Object.values(errors).includes(true)) return;
  
    // If no errors, proceed with submission
    const data = {
      name: formData.name,
      shopAddress: formData.shopAddress,
      // location: formData.location,
      shopImage: formData.shopImage,
      openingHours: `${openTime}-${closeTime}`,
      shopCategory: selectedCategory,
      subCategorys:selectedSubCategory,
      latitude:location.latitude,
      longitude:location.longitude,
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

            

            <Dropdown
              style={[
                styles.input,
                formDataError.shopCategory && { borderColor: "red", borderWidth: 1 },
              ]}
              placeholderStyle={{ fontSize: 18, color: "#888" }}
              data={shopCategory.map((item) => ({ label: item.name, value: item._id }))}
              labelField="label"
              valueField="value"
              placeholder="Select Shop Category"
              value={selectedCategory}
              onChange={(item) => {
                setSelectedCategory(item.value);
                fetchSubCategory(item.value);
              }}
            />

            <MultiSelect
              style={[
                styles.input,
                formDataError.subCategory && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholderStyle={{ fontSize: 18, color: "#888" }}
              selectedStyle={{
                backgroundColor: Colors.white,
                padding: 5,
                borderRadius: 8,
              }}
              data={subCategoryList.map((item) => ({ label: item.name, value: item._id }))}
              labelField="label"
              valueField="value"
              placeholder="Select Sub Categories"
              value={selectedSubCategory}
              onChange={setSelectedSubCategory}
              activeColor="#ffccb3"
                                 
            />

            {/* <TextInput
             style={[
              styles.input,
              formDataError.location && { borderColor: "red", borderWidth: 1 }
            ]}
              placeholder="Enter Location"
              value={formData.location}
              onChangeText={(text) => handleChange({ text, field: "location" })}
            /> */}

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

            {/* <TextInput
              style={styles.input}
              placeholder="Image Url"
              value={formData.shopImage}
              onChangeText={(text) =>
                handleChange({ text, field: "shopImage" })
              }
            /> */}

            <TimePicker openingTime={openTime} closingTime={closeTime} onChangeCloseTime={setCloseTime} onChangeOpenTime={setOpenTime} error={formDataError.openingHours} extraStyles={{padding:10}}/>

            {/* <TextInput
              style={[
                styles.input,
                formDataError.openingHours && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Shop Timings"
              value={formData.openingHours}
              onChangeText={(text) =>
                handleChange({ text, field: "openingHours" })
              }
            /> */}

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
