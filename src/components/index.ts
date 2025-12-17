// import { useState } from "react";
// type ProductID = number | string;
// enum PRODUCT  {
//     ACTIVE= "active",
//     INACTIVE= "inactive",
// };
// interface Product {
//     readonly id: ProductID;
//     name: string;
//     price: number;
//     category: string;
//     image?: string;
//     status: PRODUCT;
// }
// export default function ProductPage() {
//     const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
//     const [quantity, setQuantity] = useState<number>(1);
//     let product: Product = {
//         id: 1,
//         name: 'sos',
//         price: 5000,
//         category: 'Help',
//         status: PRODUCT.ACTIVE,
//         //status: "sold",
//     };
//     let product2: Product = {
//         id: 2,
//         name: 'sso',
//         price: 3000,
//         category: 'Help',
//         image: '/images/logo/logo1.png',
//         status: PRODUCT.INACTIVE,
//     }
//     function selectProduct(product: Product) {
//         setSelectedProduct(product);
//     }
//     function handleQuantityChange(
//         e:React.ChangeEvent<HTMLInputElement>
//     ){
//         setQuantity(Number(e.target.value));
//     };
//     const total = selectedProduct? calculateTotal(selectedProduct.price, quantity) : 0;
//     const productPrice = getProductPrice(product);
//     const productName = getProductName(product);
//     return null;
// }
// //product.id=3;

// function getProductPrice(product: Product): number {
//     return product.price;
// }
// function getProductName(product: Product): string {
//     return product.name;
// }
// function calculateTotal(price: number, quantity: number): number {
//     return price * quantity;
// }
// function applyDiscount(price: number, discount?: number): number {
//     if (discount !== undefined) {
//         return price - discount;
//     }
//     return price;
// }
