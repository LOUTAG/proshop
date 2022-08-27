import { createAsyncThunk ,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const addToCartAction = createAsyncThunk(
    'cart/addToCart',
    async(payload, { rejectWithValue, getState, dispatch })=>{
        try{
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await axios.get(`/api/products/${payload.id}`, config);
            const item = response.data;
            item.qty = payload.qty;            
            return item;
        }catch(error){
            console.log(error);
            return rejectWithValue(error.response.data);
        }
    }
)


const initialState = {
    items: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
    shippingAddress: localStorage.getItem('shippingAddress') ? JSON.parse(localStorage.getItem('shippingAddress')):{},
    paymentMethod: localStorage.getItem('paymentMethod') ? JSON.parse(localStorage.getItem('paymentMethod')):null
}

const cartSlice = createSlice({
    name: "cart",
    initialState : initialState,
    reducers:{
        updateCartQtyAction: (state, action) => {
            state.items = state.items.map(item=>{
                if(item._id === action.payload._id){
                    return {...item, qty: action.payload.qty};
                }else{
                    return item;
                }
            });
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        removeFromCartAction: (state, action)=>{
            state.items = state.items.filter(item=>{
                if(item._id !== action.payload){
                    return item;
                }else{
                    return false;
                }
            });
            localStorage.setItem('cart', JSON.stringify(state.items));
        },
        clearCartAction: (state, action)=>{
            state.items = [];
            localStorage.setItem('cart', JSON.stringify([]));
        },
        saveShippingCartAction: (state, action)=>{
            state.shippingAddress = action.payload;
            localStorage.setItem('shippingAddress', JSON.stringify(state.shippingAddress));
        },
        savePaymentMethodAction: (state, action)=>{
            state.paymentMethod = action.payload;
            localStorage.setItem('paymentMethod', JSON.stringify(state.paymentMethod));
        }
    },
    extraReducers: (builder)=>{
        builder
            .addCase(addToCartAction.pending, (state, action)=>{
                state.loading = true;
                state.error = undefined;
            })
            .addCase(addToCartAction.fulfilled, (state, action)=>{
                state.loading= false;
                state.error= undefined;

                const existItem = state.items.find(item=>item._id===action.payload._id);

                if(existItem){
                    state.items = state.items.map(item=>{
                        if(item._id === action.payload._id){
                            return {...item, qty: item.qty + action.payload.qty};
                        }else{
                            return item;
                        }
                    });
                }else{
                    state.items = [...state.items, action.payload];
                }
                localStorage.setItem('cart', JSON.stringify(state.items));
            })
            .addCase(addToCartAction.rejected, (state, action)=>{
                state.loading = false;
                state.error = action.payload.message;
            })
    }
}
);
export const { updateCartQtyAction, removeFromCartAction, saveShippingCartAction, savePaymentMethodAction, clearCartAction } = cartSlice.actions;
export default cartSlice.reducer;