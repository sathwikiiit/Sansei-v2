export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    category: string;
    tags: string;
    stock: number;
}
export interface ProductResponse {
    products: Product[];
    totalProducts: number;
    availableCategories: string[];
    maxPageSize: number;
}
export interface ApiUserDTO {
    username: string;
    email: string;
    phone: string;
    password?:string;
}
export interface ApiUser {
    id: number;
    username: string;
    email: string;
    phone: string;
    cart: Cart; 
    role: string;
}
  export interface CartItemRequest {
    productId: number;
    quantity: number;
  }
  export interface CartItem {
    id: number;
    product: Product; // Assuming you have the Product interface
    quantity: number;
  }
  export interface OrderItem {
    id: number;
    product: Product; // Assuming you have the Product interface
    quantity: number;
    priceAtPurchase: number; // To store the price at the time of order
    // Add other order item properties if needed
  }
  export interface Order {
    orderTotal: number;
    id: number;
    orderStatus: string;
    orderDate: string;
    orderAddress: string;
    orderPhone: string;
    deliveryDate: string;
    orderItems: OrderItem[];
  }
  export interface Invoice {
    id: number;
    invoiceDate: string;
    shippingCost: number;
    tax: number;
    totalAmount: number;
    // Add other invoice properties as needed
  }
  
  export interface Cart {
    id: number;
    cartItems: CartItem[]; // Changed from items: { [productId: number]: number }
    // Add other cart properties if needed
  }