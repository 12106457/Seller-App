import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Modal,
  FlatList,
  Alert,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import Colors from "@/constants/Colors";
import { MasterDataItem } from "@/models/common";
import { useSpinner } from "@/context/spinnerContext";
import { ProfileContext } from "@/context/profileContext";

const AddProductDetail = () => {
  const { id, name, image } = useLocalSearchParams();
  const imageUrl = Array.isArray(image) ? image[0] : image;
  const ProductName = Array.isArray(name) ? name[0] : name;
  const ProdId = Array.isArray(id) ? id[0] : id;

  const [selectedCategory, setSelectedCategory] = useState<MasterDataItem>();
  const [modalVisible, setModalVisible] = useState(false);
  const [ProductCategory, setProductCategory] = useState<MasterDataItem[]>([]);
  const { setLoading } = useSpinner();
  const { ShopDetails } = useContext(ProfileContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: ProductName,
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    available: false,
  });

  const [formDataError, setFormDataError] = useState({
    name: false,
    description: false,
    price: false,
    stock: false,
    category: false,
  });

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/master/get-subcategory-particular-shop/${ShopDetails?._id}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched Categories:", data);
        if (data.status) {
          setProductCategory(data.data);
        } else {
          Alert.alert(data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error.message);
        Alert.alert("Something Went Wrong During API Calling");
        setLoading(false);
      });
  }, []);

  const handleChange = ({ text, field }: { text: string; field: string }) => {
    setFormData((prev) => ({ ...prev, [field]: text }));
  };

  const handleSubmit = () => {
    const errors = {
      name: formData.name.trim() === "",
      description: formData.description.trim() === "",
      price: formData.price.trim() === "",
      stock: formData.stock.trim() === "",
      category: !selectedCategory,
    };
    setFormDataError(errors);
    if (Object.values(errors).includes(true)) return;
    UploadProductDetailsAPI();
  };

  const UploadProductDetailsAPI = () => {
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/shopProduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopId: ShopDetails?._id,
        prodId: ProdId,
        name: formData.name,
        category: selectedCategory?._id,
        description: formData.description,
        price: formData.price,
        originalPrice: formData.originalPrice || undefined,
        stock: formData.stock,
        available: formData.available,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          Alert.alert("Success!", data.message);
          router.push("/(tabs)/products");
        } else {
          Alert.alert(data.message);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error);
        setLoading(false);
      });
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: "Product Details" }} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.FormContainer}>
            <View style={styles.ImageContainer}>
              <Image
                source={{ uri: imageUrl }}
                style={{ width: 126, height: 126, borderRadius: 100 }}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.formLabel}>Name</Text>
              <TextInput
                style={[styles.input, formDataError.name && styles.incorrectData]}
                placeholder="Enter Name"
                value={formData.name}
                onChangeText={(text) => handleChange({ text, field: "name" })}
              />

              <Text style={styles.formLabel}>Description</Text>
              <TextInput
                multiline
                numberOfLines={4}
                style={[styles.inputDescription, formDataError.description && styles.incorrectData]}
                placeholder="Enter Description"
                value={formData.description}
                onChangeText={(text) => handleChange({ text, field: "description" })}
              />

              <Text style={styles.formLabel}>Category</Text>
              <TouchableOpacity
                style={[styles.dropdown, formDataError.category && styles.incorrectData]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.selectedText}>{selectedCategory?.name || "Select Category"}</Text>
              </TouchableOpacity>

              <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
              >
                <TouchableOpacity
                  style={styles.modalOverlay}
                  activeOpacity={1}
                  onPress={() => setModalVisible(false)}
                >
                  <View style={styles.dropdownContainer}>
                    <FlatList
                      data={ProductCategory}
                      keyExtractor={(item, index) => index.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.option}
                          onPress={() => {
                            setSelectedCategory(item);
                            setModalVisible(false);
                          }}
                        >
                          <Text style={styles.optionText}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                </TouchableOpacity>
              </Modal>

              <Text style={styles.formLabel}>Price (₹)</Text>
              <TextInput
                style={[styles.input, formDataError.price && styles.incorrectData]}
                placeholder="Enter Price"
                keyboardType="number-pad"
                value={formData.price}
                onChangeText={(text) => handleChange({ text, field: "price" })}
              />

              <Text style={styles.formLabel}>Original Price (₹) <Text style={{ fontWeight: 'normal' }}>(Optional)</Text></Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Original Price"
                keyboardType="number-pad"
                value={formData.originalPrice}
                onChangeText={(text) => handleChange({ text, field: "originalPrice" })}
              />

              <Text style={styles.formLabel}>Stock</Text>
              <TextInput
                style={[styles.input, formDataError.stock && styles.incorrectData]}
                placeholder="Enter Stock"
                keyboardType="number-pad"
                value={formData.stock}
                onChangeText={(text) => handleChange({ text, field: "stock" })}
              />

              <Text style={styles.formLabel}>Product Available:</Text>
              <View style={styles.availabilityContainer}>
                <TouchableOpacity
                  style={[styles.AvailBtn, formData.available ? { backgroundColor: "green" } : { borderColor: "green" }]}
                  onPress={() => setFormData({ ...formData, available: true })}
                >
                  <Text style={[styles.AvailBtnTxt, !formData.available && { color: "green" }]}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.AvailBtn, !formData.available ? { backgroundColor: "red" } : { borderColor: "red" }]}
                  onPress={() => setFormData({ ...formData, available: false })}
                >
                  <Text style={[styles.AvailBtnTxt, formData.available && { color: "red" }]}>No</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.signInBtn} onPress={handleSubmit}>
                <Text style={styles.signInTxt}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

export default AddProductDetail;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollViewContent: { flexGrow: 1, padding: 10, paddingHorizontal: 20 },
  FormContainer: {
    flex: 1,
    marginTop: 50,
    borderRadius: 10,
    backgroundColor: "#ffffff",
    paddingBottom: 20,
    paddingTop: 10,
    paddingHorizontal:10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center",
  },
  ImageContainer: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "gray",
    width: 130,
    height: 130,
    borderRadius: 100,
    top: -60,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bgColor,
  },
  inputContainer: {
    width: "100%",
    marginTop: 80,
    gap: 10,
  },
  formLabel: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 10,
  },
  input: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: Colors.bgColor,
    color: Colors.black,
    padding: 10,
    marginTop: 5,
    fontSize: 18,
  },
  inputDescription: {
    width: "100%",
    minHeight: 100,
    textAlignVertical: 'top',
    borderRadius: 5,
    backgroundColor: Colors.bgColor,
    color: Colors.black,
    padding: 10,
    marginTop: 5,
    fontSize: 18,
  },
  availabilityContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginTop: 10,
  },
  AvailBtn: {
    width: "45%",
    padding: 8,
    borderWidth: 1,
    borderRadius: 10,
  },
  AvailBtnTxt: {
    textAlign: "center",
    fontSize: 20,
    color: "white",
  },
  signInBtn: {
    width: "100%",
    padding: 10,
    backgroundColor: Colors.primaryColor,
    borderRadius: 20,
    marginTop: 10,
  },
  signInTxt: {
    color: Colors.white,
    fontSize: 20,
    textAlign: "center",
  },
  dropdown: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: Colors.bgColor,
    padding: 10,
    marginTop: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  selectedText: {
    fontSize: 18,
    color: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  dropdownContainer: {
    width: 250,
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  option: {
    padding: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  incorrectData: {
    borderWidth: 1,
    borderColor: "red",
  },
});
