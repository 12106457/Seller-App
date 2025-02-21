import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MasterDataItem, ProductDataItem } from '@/models/common';
import Colors from '@/constants/Colors';
import { FontAwesome6, Ionicons } from '@expo/vector-icons';
import { useSpinner } from '@/context/spinnerContext';

interface PropsType {
  data: ProductDataItem | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateAPI:(params: any) => void;
}

const ProductDetailsComponent = ({ data, setOpen,handleUpdateAPI }: PropsType) => {
  if (!data) return null; // Prevent rendering if no data
  const [productCategory, setProductCategory] = useState<MasterDataItem[]>([]);
  const {setLoading}=useSpinner();

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/master/get`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          setProductCategory(data.data);
        } else {
          Alert.alert(data.message);
        }
      })
      .catch((error) => {
        console.error("Error Fetching Data:", error.message);
        Alert.alert("Something Went Wrong During API Calling");
      });
  }, []);

  // State for updating product details
  const [formData, setFormData] = useState({
    name: data.name,
    description: data.description,
    price: data.price.toString(),
    stock: data.stock.toString(),
    available: data.available,
    shopCategory: data.category || '',
  });

  const [formDataError,setFormDataError]=useState({
    name: false,
    description: false,
    price: false,
    stock: false,
    shopCategory: false,
  })

  const handleUpdate = () => {
    const errors = {
        name: formData.name.trim() === "",
        description: formData.description.trim() === "",
        price: formData.price.trim() === "",
        stock: formData.stock.trim() === "",
        shopCategory: formData.shopCategory==="", 
      };
    
      // Update error state
      setFormDataError(errors);
      if (Object.values(errors).includes(true)) return;
      let updatedData={
        id:data._id,
        name:formData.name,
        category:formData.shopCategory,
        price:Number(formData.price),
        stock:Number(formData.stock),
        description:formData.description,
        available:formData.available
      }

      handleUpdateAPI(updatedData)

  };

  return (
    <Modal transparent animationType="slide" visible={!!data}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
            <Ionicons name="close-sharp" size={22} color="#fff" />
          </TouchableOpacity>

          {/* Product Image */}
          <Image source={{ uri: data.prodId.image }} style={styles.productImage} />

          {/* Editable Fields */}
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Product Name</Text>
            <TextInput 
              style={styles.input} 
              value={formData.name} 
              onChangeText={(text) => setFormData({ ...formData, name: text })} 
            />

            <Text style={styles.label}>Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              value={formData.description} 
              onChangeText={(text) => setFormData({ ...formData, description: text })} 
              multiline 
            />

            <Text style={styles.label}>Price (₹)</Text>
            <TextInput 
              style={styles.input} 
              value={formData.price} 
              onChangeText={(text) => setFormData({ ...formData, price: text })} 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Stock</Text>
            <TextInput 
              style={styles.input} 
              value={formData.stock} 
              onChangeText={(text) => setFormData({ ...formData, stock: text })} 
              keyboardType="numeric"
            />

            <Text style={styles.label}>Shop Category</Text>
            <Picker
              selectedValue={formData.shopCategory}
              onValueChange={(itemValue) => setFormData({ ...formData, shopCategory: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select a category" value="" />
              {productCategory.map((category) => (
                <Picker.Item key={category._id} label={category.name} value={category._id} />
              ))}
            </Picker>

            {/* Product Availability Toggle */}
            <Text style={styles.label}>Product Available:</Text>
            <View style={styles.availabilityContainer}>
              <TouchableOpacity
                style={[styles.availBtn, formData.available ? { backgroundColor: "green" } : { borderColor: "green" }]}
                onPress={() => setFormData({ ...formData, available: true })}
              >
                <Text style={[styles.availBtnTxt, !formData.available && { color: "green" }]}>Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.availBtn, !formData.available ? { backgroundColor: "red" } : { borderColor: "red" }]}
                onPress={() => setFormData({ ...formData, available: false })}
              >
                <Text style={[styles.availBtnTxt, formData.available && { color: "red" }]}>No</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setOpen(false)}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ProductDetailsComponent;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: Colors.primaryColor,
    padding: 8,
    borderRadius: 20,
    zIndex: 1,
  },
  productImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    marginBottom: 15,
  },
  detailsContainer: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    fontSize: 14,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  availabilityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  availBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
  },
  availBtnTxt: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ccc',
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
  },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  picker: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
  },
});
