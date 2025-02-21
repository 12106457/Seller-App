import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Keyboard,
  Alert,
  Button,
  Modal,
  Image,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { ProfileContext } from "@/context/profileContext";
import { MultiSelect } from "react-native-element-dropdown";  // Import MultiSelect
import { MasterDataItem } from "@/models/common";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useSpinner } from "@/context/spinnerContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import ToastManager,{ Toast } from "toastify-react-native";

interface formDataType {
  firstName: string;
  lastName: string;
  email:string
  shopImage: string;
  shopName: string;
  location: string;
  openingHours: string;
  shopAddress: string;
}

const fields: { label: string; value: keyof formDataType; placeholder: string }[] = [
  { label: "First Name", value: "firstName", placeholder: "Enter Name" },
  { label: "Last Name", value: "lastName", placeholder: "Enter Name" },
  { label: "Email", value: "email", placeholder: "Enter Email" },
  { label: "Shop Name", value: "shopName", placeholder: "Enter Shop Name" },
  { label: "Village Name", value: "location", placeholder: "Enter location" },
  { label: "Opening Hours", value: "openingHours", placeholder: "Enter Name" },
  { label: "Shop Address", value: "shopAddress", placeholder: "Enter Name" },
];

const EditProfile = () => {
  const route = useRouter();
  const [shopCategoryList, setShopCategoryList] = useState<MasterDataItem[]>([]);
  const [data, setData] = useState<formDataType>({
    firstName: "",
    lastName: "",
    email:"",
    shopImage: "",
    shopName: "",
    location: "",
    openingHours: "",
    shopAddress: "",
  });
  const [shopCategory, setShopCategory] = useState<string[]>([]);  // Managing shopCategory as an array
  const { profileData, ShopDetails,setProfileData,setShopDetails } = useContext(ProfileContext);
  const [SelectedimageUri, setSelectedImageUri] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [viewProfile, setViewProfile] = useState(false);
  const [onwerId,setOwnerId]=useState("");
  const {setLoading}=useSpinner();

  useEffect(() => {
     const fetchCategory = async () => {
       const ProfileData = await getData("profileData");
       if (ProfileData) {
        setOwnerId(ProfileData.id);
        console.log("proflie data:",ProfileData);
       }
     };
 
     fetchCategory();
   }, []);
  

  const selectImage = async (useLibrary: boolean) => {
      let result;
  
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 3],
        quality: 0.75,
      };
  
      if (useLibrary) {
        result = await ImagePicker.launchImageLibraryAsync(options);
      } else {
        await ImagePicker.requestCameraPermissionsAsync();
        result = await ImagePicker.launchCameraAsync(options);
      }
  
      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const name = uri.split("/").pop();
        const type = result.assets[0].type;
  
        setSelectedImageUri(uri);
      }
      setModalVisible(false);
    };
  
    const uploadImage = async () => {
      setLoading(true);
      const apiKey = "24911fe2b96d052203dd9889e71c2242";
    
      if (!SelectedimageUri) {
        Alert.alert("Error", "Please select an image first.");
        setLoading(false);
        return;
      }
    
      // Read the image file as base64
      const base64Image = await FileSystem.readAsStringAsync(SelectedimageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
    
      const data = new FormData();
      data.append("image", base64Image);
    
      try {
        const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: data,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
    
        const result = await response.json();
    
        if (result.success) {
          const imageUrl = result.data.image.url;
         
          return imageUrl;  
        } else {
          setLoading(false);
          Toast.error("Faile to upload the image")
        }
      } catch (error) {
        console.error("Error uploading image:", error);
        setLoading(false);
        Toast.error("Please try again later")
      }
    };
    
  
    
    const getData = async (key:any) => {
      try {
        const value = await AsyncStorage.getItem(key);
        return value ? JSON.parse(value) : null;
      } catch (error) {
        console.error("Error in getting data from localstorage");
      }
    }



  useEffect(() => {
    setData({
      firstName: profileData?.firstname || "",
      lastName: profileData?.lastname || "",
      email:profileData?.email||"",
      shopImage: ShopDetails?.shopImage || "",
      shopName: ShopDetails?.name || "",
      location: ShopDetails?.location || "",
      openingHours: ShopDetails?.openingHours || "",
      shopAddress: ShopDetails?.shopAddress || "",
    });
    setShopCategory(ShopDetails?.shopCategory || []);  // Set initial selected categories
    
  }, [profileData, ShopDetails]);

  useEffect(() => {
      const fetchCategory = async () => {
        const categoryList = await getData("shopCategory");
        if (categoryList) {
          setShopCategoryList(categoryList);
        }
      };
  
      fetchCategory();
    }, []);

  const handleChange = (text: any, field: string) => {
    setData((prev: any) => ({ ...prev, [field]: text }));
  };

  const handleCategoryChange = (selectedItems: string[]) => {
    setShopCategory(selectedItems);  // Update selected categories
  };

 

  const handleSubmit = async() => {
    if (
      !data.firstName.trim() ||
      !data.lastName.trim() ||
      !data.email.trim() ||
      !data.shopName.trim() ||
      !data.shopAddress.trim() ||
      !data.openingHours.trim() ||
      !data.location.trim() 
    ) {
      Toast.warn("Fill all the fields")
      return;
    }
    if(SelectedimageUri===""){
      const UpdatedData={
        firstname:data.firstName,
        lastName:data.lastName,
        email:data.email,
        name:data.shopName,
        location:data.location,
        openingHours:data.openingHours,
        shopAddress:data.shopAddress,
        shopCategory:shopCategory,
        shopImage:data.shopImage
      }
      UpdateAPI(UpdatedData)
    }else{
      const imageUrl = await uploadImage();
        if (imageUrl) {
          console.log("Image URL:", imageUrl);
          const UpdatedData={
            firstname:data.firstName,
            lastName:data.lastName,
            email:data.email,
            name:data.shopName,
            location:data.location,
            openingHours:data.openingHours,
            shopAddress:data.shopAddress,
            shopCategory:shopCategory,
            shopImage:imageUrl
          }
          UpdateAPI(UpdatedData)
        }else{
          return;
        }
    }

  };

  const UpdateAPI=(data:any)=>{
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/update/profile/${onwerId}`, {
      method: "PUT",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("response:",data);
        if (data.status) {
          setProfileData(data.data.profileData);
          setShopDetails(data.data.shopDetails);
          Toast.success("Update Successfully")
          setLoading(false);
        }else{
          setLoading(false);
          Toast.error(data.message);
        }
      })
      .catch((error) => {
        setLoading(false);
       Toast.error("Please try again later")
      });
  }
  

  return (
    <>
   <ToastManager/>
      <Stack.Screen
        options={{
          headerTitle: "Edit Profile",
          headerTitleAlign: "center",
          headerShown:true,
          headerLeft: () => {
            return (
              <TouchableOpacity
                onPress={() => route.back()}
                style={styles.headerLeft}
              >
                <AntDesign name="left" size={20} color="black" />
              </TouchableOpacity>
            );
          },
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
          keyboardVerticalOffset={100}
        >
          <ScrollView contentContainerStyle={styles.scrollContent} 
            keyboardShouldPersistTaps="always"  
                        // scrollEnabled={true}  
            keyboardDismissMode="interactive">
            <View style={styles.ProfileContainer}>
              <TouchableOpacity style={styles.image} onPress={()=>{setModalVisible(true)}}>
                {
                  ShopDetails?.shopImage===""?
                  (<FontAwesome name="user-circle-o" size={140} color="black" />):
                  (SelectedimageUri===""?
                    (<Image source={{uri:ShopDetails?.shopImage}} resizeMode="cover" style={{width:150,height:150,borderRadius:100,borderWidth:2}}/>)
                  :(<Image source={{uri:SelectedimageUri}} resizeMode="cover" style={{width:150,height:150,borderRadius:100,borderWidth:2}}/>))
                }
              </TouchableOpacity>
            </View>
            <View style={styles.FormContainer}>
              {fields.map((field, index) => (
                <View style={styles.formSection} key={index}>
                  <Text style={styles.formLabel}>{field.label}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center", position: "relative" }}>
                    <TextInput
                      style={[styles.inputField, { flex: 1 }]}
                      value={data[field.value]}
                      placeholder={field.placeholder}
                      onChangeText={(text) => handleChange(text, field.value)}
                    />
                    <View style={styles.tickMark}>
                      {data[field.value].length > 0 ? (
                        <AntDesign name="checkcircle" size={24} color="green" />
                      ):(<AntDesign name="closecircle" size={24} color="red" />)}
                    </View>
                  </View>
                </View>
              ))}

              {/* Adding MultiSelect for Shop Category */}
              <View style={styles.formSection}>
                <Text style={styles.formLabel}>Shop Category</Text>
                <MultiSelect
                  data={shopCategoryList.map((item) => ({
                    label: item.name, // Corrected here
                    value: item._id
                  })) || []}
                  labelField="label"
                  valueField="value"
                  placeholder="Select Categories"
                  value={shopCategory}
                  onChange={handleCategoryChange}
                  search
                  disable={false}
                  style={styles.multiSelect}
                  selectedTextStyle={styles.selectedText}
                  renderItem={(item) => (
                    <View style={styles.item}>
                      <Text style={styles.itemText}>{item.label}</Text>
                    </View>
                  )}
                />
              </View>
              <Button title="Update" color={Colors.primaryColor} onPress={()=>{handleSubmit()}} />
            </View>
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {setModalVisible(false);setViewProfile(false)}}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => {setModalVisible(false);setViewProfile(false)}}>
        <View style={styles.modalContent}>
          {!viewProfile ? (
            <>
              {ShopDetails?.shopImage.trim() !== ""&&<Button title="View Profile" onPress={() => setViewProfile(true)} />}
              <Button title="Gallery" onPress={() => selectImage(true)} />
              <Button title="Capture Image" onPress={() => selectImage(false)} />
            </>
          ) : (
            <>
             
              <Image 
                source={{ uri: ShopDetails?.shopImage }} 
                style={styles.profileImage} 
                resizeMode="cover" 
              />
              <Button title="Close" color={Colors.primaryColor} onPress={() => setViewProfile(false)} />
            </>
          )}
        </View>
      </TouchableOpacity>
    </Modal>
          </ScrollView>

        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  headerLeft: {
    marginLeft: 5,
    padding: 5,
  },
  headerRight: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.primaryColor,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  ProfileContainer: {
    width: "100%",
    height: 180,
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
  FormContainer: {
    width: "100%",
    padding: 20,
    marginBottom: 0,
    gap: 15,
  },
  formSection: {
    justifyContent: "center",
    alignItems: "flex-start",
  },
  formLabel: {
    fontSize: 20,
    fontWeight: "500",
  },
  inputField: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#ebeded",
    color: Colors.black,
    padding: 10,
    marginTop: 5,
    fontSize: 18,
  },
  tickMark: {
    position: "absolute",
    right: 10,
  },
  multiSelect: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#ebeded",
    padding: 10,
  },
  selectedText: {
    fontSize: 18,
  },
  item: {
    padding: 10,
  },
  itemText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 350,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    gap: 20,
  },
  profileImage: {
    width: 310,
    height: 280,
    borderRadius: 5,
    borderWidth:2,
    marginBottom: 10,
  },
});
