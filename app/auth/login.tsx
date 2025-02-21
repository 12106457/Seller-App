import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { AntDesign, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSpinner } from "@/context/spinnerContext";
import { loginResponse } from "@/models/common";
import { ProfileContext } from "@/context/profileContext";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Container, { Toast } from 'toastify-react-native';
import { useAuth } from "@/context/authContext";
const login = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
  });
  const router = useRouter();
  const { setLoading } = useSpinner();
  const {setAuthToken,setProfileData,setShopDetails}=useContext(ProfileContext)
  const [formDataError,SetFormDataError]=useState({
    phone:false,
    password:false
  })
  const [secureText, setSecureText] = useState(true);
  const { login } = useAuth();
  const toggleSecureTextEntry = () => {
    setSecureText(!secureText);
  };
  const handleChange = ({ text, field }: { text: string; field: string }) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  useEffect(()=>{
    fetchShopCategory();
  },[])

 

  const storeData = async (key:any, value:any) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      console.log("Data stored successfully");
    } catch (error) {
      console.error("Error storing data:", error);
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

  const fetchShopCategory = () => {
    // setLoading(true);
      fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/master/get`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((errorText) => {
              console.error("Server Error:", errorText);
              throw new Error("Something went wrong");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (data.status) {
            storeData("shopCategory",data.data);
            setLoading(false);
          } else {
            Toast.error(data.message);
          }
        })
        .catch((error) => {
          console.error("Error Fetching Data:", error.message);
          Toast.error("Something went wrong")
        });
        
    };

  const handleSubmit = () => {
   
    const errors = {
      phone: formData.phone.trim() === "",
      password: formData.password.trim() === "",
    };
  
    
    SetFormDataError(errors);
  
   
    if (Object.values(errors).includes(true)) return;
  
    
    LoginApi();
  };
  
  const LoginApi = async () => {
    try {
      setLoading(true);
  
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phone: Number(formData.phone),
            password: formData.password,
          }),
        }
      );
  
    
  
      const data:loginResponse = (await response.json()) as loginResponse;
      setLoading(false);
  
      if (data.status) {
        setAuthToken(data.token);
        setProfileData(data.data);
        setShopDetails(data.data.shopDetails);
        storeData("profileData",data.data);
        storeData("authToken",data.token);
        if(data.data.shopDetails===null){
          Toast.warn('Kindly Complete Shop Registion');
          setTimeout(()=>{
            router.push("/auth/register?shopRegister=false");
        },1000)
        }else{
          Toast.success('Login Success');
          setTimeout(()=>{
            login();  
            router.push("/(tabs)/dashboard");

          },1000)
        }
      } else {
        Toast.error(data.message);
      }
    } catch (error: any) {
      console.error("Error Fetching Data:", error.message);
      setLoading(false);
      Toast.error(error?.message||"Please try again later");
    }
  };
  const handleToast = async () => {
    Toast.success('Promise if Resolved');
  };
  
  
  return (
    <View style={styles.container}>
      <Container position="top" />
      <View style={{ width: "100%", height: "45%" }}>
        <ImageBackground
          source={require("../../assets/images/loginbgImage.png")}
          style={styles.bgImage}
          resizeMode="cover"
        ></ImageBackground>
      </View>
      <View style={{ width: "100%", height: "55%" }}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/splashlogo.png")}
            style={styles.logo}
          />
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>India's Fastest App</Text>
          <Text style={styles.subtitle}>Log in</Text>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              formDataError.phone && { borderColor: "red", borderWidth: 1 }
            ]}
            keyboardType="phone-pad"
            placeholder="Enter Phone"
            onChangeText={(text) => handleChange({ text, field: "phone" })}
          />
          <View style={styles.passwordcontainer}>
            <TextInput
              style={[
                styles.input,
                formDataError.password && { borderColor: "red", borderWidth: 1 }
              ]}
              placeholder="Enter Password"
              secureTextEntry={secureText}
              onChangeText={(text) => handleChange({ text, field: "password" })}
            />
            <TouchableOpacity
              onPress={toggleSecureTextEntry}
              style={styles.iconContainer}
            >
              {!secureText ? (
                <AntDesign
                  name={"eyeo"} // Change icon based on visibility
                  size={24}
                  color="gray"
                />
              ) : (
                <Octicons name="eye-closed" size={24} color="gray" />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signInBtn} onPress={() =>{handleSubmit()}}>
            <Text style={styles.signInTxt}>Log In</Text>
          </TouchableOpacity>
        </View>
          <Text style={{textAlign:"center",marginVertical:5,fontSize:16}}>OR</Text>
         <View style={{width:"100%",paddingHorizontal:20}}>
         <TouchableOpacity style={styles.signupBtn} onPress={() => {router.push("/auth/register?shopRegister=true")}}>
            <Text style={styles.signupTxt}>Register</Text>
          </TouchableOpacity>
         </View>
      </View>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  bgImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: "100%",
    height: 120,
    marginTop: -50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: Colors.primaryColor,
    tintColor: Colors.white,
  },
  titleContainer: {
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginTop: 15,
    gap: 15,
    paddingHorizontal: 20,
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
  passwordcontainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -12 }],
  },
  signInBtn: {
    width: "100%",
    padding: 15,
    // backgroundColor:"#0373fc",
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
  },
  signInTxt: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
  },
  signupBtn:{
    width: "100%",
    padding: 11,
    // backgroundColor:"#0373fc",
    borderWidth:2,
    borderColor: Colors.primaryColor,
    borderRadius: 20,
  },
  signupTxt:{
    textAlign:"center",
    color: Colors.primaryColor,
    fontSize: 20,
  }
});
