import { Alert, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import { Stack, useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { useSpinner } from '@/context/spinnerContext';
import { ProfileContext } from '@/context/profileContext';
import { ProductDataItem, productResponse } from '@/models/common';
import ProductDetailsComponent from "@/components/ProductDetailsComponent";

const Products = () => {
  const router = useRouter();
  const { setLoading } = useSpinner();
  const { ShopDetails } = useContext(ProfileContext);
  const [productList, setProductList] = useState<ProductDataItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductDataItem[]>([]); // New state to hold filtered products
  const [productData, setProductData] = useState<ProductDataItem>();
  const [seeProduct, setSeeProduct] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<string>('all'); // State to track the selected filter

  useEffect(() => {
    fetchShopProducts();
  }, []); // Fetch products once on component mount

  useEffect(() => {
    // Apply filter logic when the filterStatus changes
    if (filterStatus === 'all') {
      setFilteredProducts(productList);
    } else if (filterStatus === 'available') {
      setFilteredProducts(productList.filter((product) => product.available));
    } else if (filterStatus === 'notAvailable') {
      setFilteredProducts(productList.filter((product) => !product.available));
    }
  }, [filterStatus, productList]); // Trigger when filterStatus or productList changes

  const fetchShopProducts = () => {
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/getShopProducts/${ShopDetails?._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data: productResponse) => {
        if (data.status) {
          setProductList(data.data);
          setFilteredProducts(data.data); // Initially set filtered products to all products
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
  };

  const updateProductApi = (params: any) => {
    setLoading(true);
    fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/shop/updateProduct`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status) {
          fetchShopProducts();
          setSeeProduct(false);
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
  };

  // Render each product item
  const renderItem = ({ item }: { item: ProductDataItem }) => (
    <TouchableOpacity
      style={[
        styles.productCard,
        !item.available && styles.unavailableProductCard,
      ]}
      onPress={() => { setProductData(item); setSeeProduct(true); }}
    >
      <Image source={{ uri: item.prodId.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDescription}>{item.description}</Text>
        <Text style={styles.productPrice}>Price: ₹{item.price}</Text>
        <Text style={styles.productStock}>Stock: {item.stock}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Shop Products",
          headerRight: () => (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                router.push("/commonRoute/addNewProductImage");
              }}
            >
              <FontAwesome6 name="add" size={20} color={Colors.white} />
              <Text style={styles.addButtonText}>Add Product</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterBtn, filterStatus === 'all' && styles.activeFilterBtn]}
            onPress={() => setFilterStatus('all')}
          >
            <Text style={styles.filterBtnTxt}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterStatus === 'available' && styles.activeFilterBtn]}
            onPress={() => setFilterStatus('available')}
          >
            <Text style={styles.filterBtnTxt}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterBtn, filterStatus === 'notAvailable' && styles.activeFilterBtn]}
            onPress={() => setFilterStatus('notAvailable')}
          >
            <Text style={styles.filterBtnTxt}>Not Available</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={filteredProducts} // Use filtered products for display
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListEmptyComponent={<Text style={styles.emptyList}>No products available</Text>}
          contentContainerStyle={filteredProducts.length === 0 ? styles.emptyContainer : {}}
        />
        {
          seeProduct && (
            <ProductDetailsComponent data={productData} setOpen={setSeeProduct} handleUpdateAPI={updateProductApi} />
          )
        }
      </View>
    </>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F5F5F5",
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productCard: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  productDescription: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginTop: 5,
  },
  productStock: {
    fontSize: 14,
    color: "green",
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.primaryColor,
    padding: 5,
    paddingVertical: 7,
    borderRadius: 5,
    marginRight: 15,
  },
  addButtonText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  emptyList: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  unavailableProductCard: {
    backgroundColor: "#D3D3D3",
  },
  filterContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 15,
    alignItems: "center",
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  filterBtn: {
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    backgroundColor:"gray", 
  },
  activeFilterBtn: {
    backgroundColor: Colors.primaryColor, 
  },
  filterBtnTxt: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
  },
});
