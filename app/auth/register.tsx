import { StyleSheet, Text, View, ImageBackground, Alert } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import UserProfileComponent from "@/components/userProfileComponent";
import ProgressStep from "@/components/progressStepComponent";
import ShopRegisterComponent from "@/components/shopRegisterComponent";
import { useSpinner } from "@/context/spinnerContext";
import { loginResponse, RegisterData, RegisterResponse } from "@/models/common";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ProfileContext } from "@/context/profileContext";
import { Toast } from "toastify-react-native";
interface userProfileType {
  lastname: string;
  firstname: string;
  email:string;
  phone: string;
  password: string;
}

interface shopRegisterType {
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
const Register = () => {
  const [step, setStep] = useState(1);
  const { setLoading } = useSpinner();
  const [userId, setUserId] = useState<string>("");
  const router = useRouter();
  const {shopRegister}=useLocalSearchParams();
 const {profileData}=useContext(ProfileContext)

  useEffect(()=>{
    console.log("shopRegister:",shopRegister);
    if(shopRegister==='false'){

      setStep(2);
      setUserId(profileData?.id||"");
    }
  },[shopRegister])

  const handleCreateUserProfile = (params: userProfileType) => {
    console.log("userProfile Data:", params);
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname: params.firstname,
        lastname: params.lastname,
        email:params.email,
        phone: Number(params.phone),
        password: params.password,
      }),
    })
      .then((response) => {
        

        return response.json();
      })
      .then((data: RegisterResponse) => {
        console.log("Register Response:", data);
        setLoading(false);
        if (data.status) {
          setUserId(data.data._id);
          Toast.success(data.message);
          setStep(2);
        } else {
          Toast.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error.message);
        setLoading(false);
        Toast.success(error.message || "Please try again later");
      });
  };
  const handleRegisterShop = (params: shopRegisterType) => {
    console.log("shopRegister Data:", params);
    setLoading(true);
    fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/add/${userId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    )
      .then((response) => {
        

        return response.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.status) {
          Toast.error(data.message);
          setTimeout(()=>{
            router.push("/auth/login");
          },1000)
        } else {
          Toast.error(data.message);
        }
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error.message);
        setLoading(false);
        Toast.success(error.message || "Please try again later");
      });
  };
  return (
    <ImageBackground
      source={require("../../assets/images/registerbgImage.png")} // Update path accordingly
      style={styles.background}
      resizeMode="cover" // You can use 'contain', 'stretch', or 'repeat' as well
    >
      <View style={styles.container}>
        <ProgressStep currentStep={step} />
        {step === 1 && (
          <UserProfileComponent onSave={handleCreateUserProfile} />
        )}
        {step === 2 && <ShopRegisterComponent onSave={handleRegisterShop} />}
      </View>
    </ImageBackground>
  );
};

export default Register;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)", // Optional: Add transparency for readability
    padding: 5,
  },
});
