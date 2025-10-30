import React, { useContext, useEffect, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MasterDataItem, ProductDataItem } from '@/models/common';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useSpinner } from '@/context/spinnerContext';
import { ProfileContext } from '@/context/profileContext';

interface PropsType {
  data: ProductDataItem | undefined;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleUpdateAPI: (params: any) => void;
}

const ProductDetailsComponent = ({ data, setOpen, handleUpdateAPI }: PropsType) => {
  if (!data) return null;

  const [productCategory, setProductCategory] = useState<MasterDataItem[]>([]);
  const { ShopDetails } = useContext(ProfileContext);
  const { setLoading } = useSpinner();

  useEffect(() => {
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/master/get-subcategory-particular-shop/${ShopDetails?._id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
                console.log("Fetched Categories:", data);

        if (data.status) {
          setProductCategory(data.data);
        } else {
          Alert.alert(data.message);
        }
      })
      .catch((error) => {
        console.error('Error Fetching Data:', error.message);
        Alert.alert('Something Went Wrong During API Calling');
      });
  }, []);

  const [formData, setFormData] = useState({
    name: data.name,
    description: data.description,
    price: data.price.toString(),
    originalPrice: data.originalPrice?.toString() || '', // Optional chaining in case it's not present
    stock: data.stock.toString(),
    available: data.available,
    shopCategory: data.category || '',
  });

  const [formDataError, setFormDataError] = useState({
    name: false,
    description: false,
    price: false,
    stock: false,
    shopCategory: false,
  });

  const handleUpdate = () => {
    const errors = {
      name: formData.name.trim() === '',
      description: formData.description.trim() === '',
      price: formData.price.trim() === '',
      stock: formData.stock.trim() === '',
      shopCategory: formData.shopCategory === '',
    };

    setFormDataError(errors);
    if (Object.values(errors).includes(true)) return;

    const updatedData = {
      id: data._id,
      name: formData.name,
      category: formData.shopCategory,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : 0,
      stock: Number(formData.stock),
      description: formData.description,
      available: formData.available,
    };

    handleUpdateAPI(updatedData);
  };

  return (
    <Modal transparent animationType="slide" visible={!!data}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setOpen(false)}>
            <Ionicons name="close-sharp" size={22} color="#fff" />
          </TouchableOpacity>

          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: data.prodId.image }} style={styles.productImage} />

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
                scrollEnabled
                textAlignVertical="top"
              />

              <Text style={styles.label}>Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={formData.price}
                onChangeText={(text) => setFormData({ ...formData, price: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Original Price (₹)</Text>
              <TextInput
                style={styles.input}
                value={formData.originalPrice}
                onChangeText={(text) => setFormData({ ...formData, originalPrice: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Stock</Text>
              <TextInput
                style={styles.input}
                value={formData.stock}
                onChangeText={(text) => setFormData({ ...formData, stock: text })}
                keyboardType="numeric"
              />

              <Text style={styles.label}>Sub Category</Text>
              <View style={styles.pickerWrapper}>
                <Picker
                  selectedValue={formData.shopCategory}
                  onValueChange={(itemValue) => setFormData({ ...formData, shopCategory: itemValue })}
                >
                  <Picker.Item label="Select a category" value="" />
                  {productCategory.map((category) => (
                    <Picker.Item key={category._id} label={category.name} value={category._id} />
                  ))}
                </Picker>
              </View>

              <Text style={styles.label}>Product Available:</Text>
              <View style={styles.availabilityContainer}>
                <TouchableOpacity
                  style={[styles.availBtn, formData.available ? { backgroundColor: 'green' } : { borderColor: 'green' }]}
                  onPress={() => setFormData({ ...formData, available: true })}
                >
                  <Text style={[styles.availBtnTxt, !formData.available && { color: 'green' }]}>Yes</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.availBtn, !formData.available ? { backgroundColor: 'red' } : { borderColor: 'red' }]}
                  onPress={() => setFormData({ ...formData, available: false })}
                >
                  <Text style={[styles.availBtnTxt, formData.available && { color: 'red' }]}>No</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setOpen(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleUpdate}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
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
    maxHeight: '95%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingTop: 20,
    paddingBottom: 10,
    elevation: 5,
    overflow: 'hidden',
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
  scrollArea: {
    width: '100%',
  },
  scrollContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  productImage: {
    width: 150,
    height: 150,
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
    height: Platform.OS === 'ios' ? 80 : 100,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
    overflow: 'hidden',
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
});
