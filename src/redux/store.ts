// src/app/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/auth-slice";
import profileReducer from "./features/user/user-slice";
import { categoryReducer } from './features/category/category-slice';
import { productReducer } from './features/product/product-slice';
import { cartReducer } from './features/cart/cart-slice';
import { orderReducer } from './features/order/order-slice';
import { chatReducer } from './features/chat/chat-slice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    categories: categoryReducer,
    products: productReducer,
    cart: cartReducer,
    order : orderReducer,
    chat : chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
