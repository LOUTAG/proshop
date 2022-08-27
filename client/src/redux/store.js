import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './slices/productsSlice';
import usersReducer from './slices/usersSlice';
import cartReducer from './slices/cartSlice';
import ordersReducer from "./slices/orderSlice";
import searchReducer from "./slices/searchSlice";

const store = configureStore({
    reducer:{
        products: productsReducer,
        users: usersReducer,
        cart : cartReducer,
        orders: ordersReducer,
        search: searchReducer,
    }
});

export default store;