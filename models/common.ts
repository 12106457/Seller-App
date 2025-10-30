export interface MasterDataItem{
    _id:number,
    name:string,
    short_name:string,
    symbol:string
}

export interface RegisterResponse{
    status:boolean,
    message:string,
    data:RegisterData
}
export interface RegisterData{
    _id:string,
    lastname:string,
    firstname:string,
    phone:number
}

export interface loginResponse{
    status:boolean,
    message:string,
    token:string,
    data:UserData
}

export interface UserData{
    id: string,
    firstname: string,
    lastname: string,
    email:string,
    phone: number,
    shopDetails:shopDetails|null
}
export interface shopDetails{
    _id:string,
    shopId: string,
    name: string,
    shopAddress:string,
    location: string,
    shopCategory:string,
    subCategorys:string[],
    shopImage:string,
    openingHours:string,
    rating: number,
    status:boolean,
    
}

export interface searchProductResponse{
    status:boolean,
    message:string,
    data:searchProductData[]
}

export interface searchProductData{
    _id: string,
    name: string,
    image: string
}

export interface productResponse{
    status:boolean;
    message:string;
    data:ProductDataItem[];
}
export interface ProductDataItem {
    _id: string;
    shopId: string;
    prodId: searchProductData;
    name:string;
    category: string;
    description: string;
    price: number;
    originalPrice?:number;
    stock: number;
    available: boolean;
};

export interface dashboardResponse{
    status:boolean,
    message:string,
    data?:dashboardData
}
export interface dashboardData {
  todayCollection: number;
  yesterdayCollection: number;
  productCount: number;
  todayOrderCount: number;
  totalMonthlyOrders:number;
  totalMonthlyAmount: number;
  cancelledOrders: number;
  deliveredOrders: number;
  pendingOrders: number;
  processedOrders: number,

}
export interface faqResponse{
    status:boolean,
    message:string,
    data?:faqData[]
}
export interface faqData{
    _id:string,
    question:string,
    answer:string
}

export interface notificationResponse{
    status:boolean,
    message:string,
    data?:notificationData[]
}

export interface notificationData{
    ShopId: number,
    title: string,
    message:string,
    isRead:boolean
}

  
export interface OrderItemData {
    _id: string;
    orderNo: string;
    sellerId: string;
    customerId: CustomerId;
    items: Item[];
    totalOrderAmount: number;
    status: string;
    paymentStatus: string;
    paymentMethod: string;
    deliveryStatus: string;
    orderDate: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }
  
 export interface Item {
    _id: string;
    productId: ProductId;
    quantity: number;
    totalAmount: number;
 }
  
export interface ProductId {
    _id: string;
    prodId: ProdId;
    name: string;
    category: string;
    description: string;
    price: number;
}
  
export interface ProdId {
    _id: string;
    image: string;
}
  
export interface CustomerId {
    _id: string;
    name: string;
    email: string;
    phone: string;
    image: null;
    address: Address;
    location: Location;
}
  
export interface Location {
    type: string;
    coordinates: number[];
}
  
export interface Address {
    street: string;
    city: string;
    state: string;
    country: string;
    pinCode: string;
}
  


