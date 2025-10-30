import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Button,
  Image,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Stack, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { searchProductData, searchProductResponse } from "@/models/common";
import { useSpinner } from "@/context/spinnerContext";
import {toTitleCase} from "@/utility/textToTitleCaseConverter"

const addNewProduct = () => {
  const [selectedOption, setSelectedOption] = useState(1); // Default selected: Upload Image
  const [productName, setProductName] = useState("");
  const [error, setError] = useState({
    image: false,
    name: false,
  });
  const router=useRouter();
  const [SelectedimageUri, setSelectedImageUri] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [imagePublicUrl, setImagePublicUrl] = useState("");
  const {setLoading}=useSpinner();

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
      return;
    }

    // Read the image file as base64
    const base64Image = await FileSystem.readAsStringAsync(SelectedimageUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const data = new FormData();
    data.append("image", base64Image);

    fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: data,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("response:",data);
        if (data.success) {
          console.log(data);
          const imageUrl=data.data.image.url
          setImagePublicUrl(imageUrl);
          handleUploadProduct(imageUrl);
        }
      })
      .catch((error) => {
        console.error("Error uploading image:", error);
      });
      
  };

  const handleUploadProduct = (imageurl: string) => {
    
    fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/product`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({
          name:productName,
          image:imageurl
        })
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.status) {
          Alert.alert("Succes!", "Uploaded product image"); 
        }
        setLoading(false);
        router.push(`/commonRoute/addProductDetail?id=${data.data._id}&image=${data.data.image}&name=${data.data.name}`)
      })
      .catch((error) => {
        console.error("Error in search api:", error);
        setLoading(false);
      });
     
  };

  const handleSubmit = () => {
    const errors = {
      name: productName.trim() === "",
      image: SelectedimageUri === "",
    };

    setError(errors);

    if (Object.values(errors).includes(true)) return;
    uploadImage();
  };

  //-----------------------search product code---------------------
  const [searchText, setSearchText] = useState<string>("");
  const [productList, setProductList] = useState<searchProductData[]>([]);
console.log("searchText:",searchText);
  useEffect(() => {
   if(selectedOption===2){
    fetchSeatchProducts();
   }
  }, [searchText,selectedOption]);

  const fetchSeatchProducts = () => {
    setLoading(true);
    fetch(
      `${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/productSearch?search=${searchText==undefined?"":searchText}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data: searchProductResponse) => {
        if (data.status) {
          // console.log(data);
          setProductList(data.data);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error("Error in search api:", error);
      });
      
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Select Product",
        }}
      />
      <View style={styles.container}>
        <View style={styles.optionContainer}>
          {/* Upload Image Button */}
          <TouchableOpacity
            style={[
              styles.optionItem,
              selectedOption === 1 ? styles.selected : styles.unselected,
            ]}
            onPress={() => setSelectedOption(1)}
          >
            <Text style={styles.optionText}>Upload Image</Text>
          </TouchableOpacity>

          {/* Search Product Button */}
          <TouchableOpacity
            style={[
              styles.optionItem,
              selectedOption === 2 ? styles.selected : styles.unselected,
            ]}
            onPress={() => setSelectedOption(2)}
          >
            <Text style={styles.optionText}>Search Image</Text>
          </TouchableOpacity>
        </View>

        {selectedOption === 1 && (
          <View style={[styles.SubContainer, { marginTop: 50 }]}>
            <View style={styles.uploadContainer}>
              <Text style={styles.Title}>Upload Product Image</Text>
              {!SelectedimageUri && (
                <TouchableOpacity
                  style={[
                    styles.imageSection,
                    error.image && { borderColor: "red", borderWidth: 2 },
                  ]}
                  onPress={() => setModalVisible(true)}
                >
                  <AntDesign name="camerao" size={68} color="gray" />
                </TouchableOpacity>
              )}
              {SelectedimageUri && (
                <TouchableOpacity
                  style={styles.imageSection}
                  onPress={() => setModalVisible(true)}
                >
                  <Image
                    source={{ uri: SelectedimageUri }}
                    style={{
                      width: 170,
                      height: 170,
                      borderRadius: 100,
                      borderWidth: 2,
                    }}
                  />
                </TouchableOpacity>
              )}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    error.name && { borderColor: "red", borderWidth: 1 },
                  ]}
                  placeholder="Enter Product Name"
                  onChangeText={(text) => setProductName(text)}
                />
                <TouchableOpacity
                  style={styles.signInBtn}
                  onPress={() => {
                    handleSubmit();
                  }}
                >
                  <Text style={styles.signInTxt}>Upload</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity
                style={styles.modalOverlay}
                activeOpacity={1}
                onPressOut={() => setModalVisible(false)}
              >
                <View style={styles.modalContent}>
                  <Button title="Gallery" onPress={() => selectImage(true)} />
                  <Button
                    title="Capture Image"
                    onPress={() => selectImage(false)}
                  />
                </View>
              </TouchableOpacity>
            </Modal>
          </View>
        )}

        {selectedOption === 2 && (
          <View style={styles.SubContainer}>
            <View
              style={[
                styles.inputContainer,
                {
                  borderBottomWidth: 1.5,
                  borderBottomColor: "black",
                  paddingBottom: 5,
                },
              ]}
            >
              <TextInput
                placeholder="Search Image"
                onChangeText={(text) => setSearchText(text)}
                style={styles.input}
              />
            </View>

            {/* Grid View */}
            <FlatList
              data={productList}
              numColumns={2} // Set number of columns for the grid
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.productItem} onPress={()=>{
                  router.push(`/commonRoute/addProductDetail?id=${item._id}&image=${item.image}&name=${item.name}`)
                }}  >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.productImage}
                  />
                  <Text style={styles.productName}>{toTitleCase(item.name)}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
      </View>
    </>
  );
};

export default addNewProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  optionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "auto",
    width: "90%",
    height: 50,
    marginTop: 20,
  },
  optionItem: {
    width: "46%",
    paddingVertical: 10,
    borderRadius: 7,
    alignItems: "center",
  },
  selected: {
    backgroundColor: Colors.primaryColor,
  },
  unselected: {
    backgroundColor: "gray",
  },
  optionText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
  SubContainer: {
    flex: 1,
  },
  uploadContainer: {
    height: "65%",
    marginVertical: 10,
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
  Title: {
    textAlign: "center",
    fontWeight: "800",
    fontSize: 24,
    marginTop: 10,
  },
  imageSection: {
    justifyContent: "center",
    alignItems: "center",
    width: 170,
    height: 170,
    borderWidth: 2,
    borderRadius: 100,
    marginHorizontal: "auto",
    borderColor: "gray",
    borderStyle: "dashed",
    backgroundColor: "#dee0e3",
    marginTop: 30,
  },
  inputContainer: {
    width: "100%",
    marginTop: 30,
    gap: 15,
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    borderRadius: 15,
    backgroundColor: "#fcf1de",
    color: Colors.black,
    fontWeight: "700",
    padding: 15,
    marginTop: 5,
    fontSize: 18,
  },
  signInBtn: {
    marginHorizontal: "auto",
    width: "50%",
    padding: 10,
    // backgroundColor:"#0373fc",
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    marginVertical: 10,
  },
  signInTxt: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: 300,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    justifyContent: "space-between",
    gap: 20,
  },
  productItem: {
    flex: 1,
    alignItems: "center",
    margin: 10,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productName: {
    marginTop: 5,
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
});
