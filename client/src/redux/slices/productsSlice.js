import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//FIRST, CREATE THE THUNK AND EXPORT

// @ desc async action to fetch all product
export const fetchProductList = createAsyncThunk(
  "products/list",
  async(page, { rejectWithValue, getState, dispatch }) => {
    try {
      const query = page ? page : 1;
      console.log(query);
      const response = await axios.get(`/api/products?page=${query}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
);

// @ desc async action to fetch one product
export const fetchDetailsProduct = createAsyncThunk(
  "product/details",
  async(payload, {rejectWithValue, getState, dispatch})=>{
    try{
      const response = await axios.get(`/api/products/${payload}`);
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
)

//INITIAL STATE
const initialState = {
  productsList:[],
  productDetails: {}
}

//THEN, CREATE THE SLICE : HANDLE ACTUONS IN YOUR REDUCERS
const productsSlice = createSlice({
  name: "products",
  initialState: initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductList.pending, (state, action) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchProductList.fulfilled, (state, action) => {
        state.productsList = action.payload.products;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
        state.loading = false;
        state.error = undefined;
      })
      .addCase(fetchProductList.rejected, (state, action)=>{
        state.error = action.payload.message ? action.payload.message : action.payload;
        state.loading = false;
      });
      builder
      .addCase(fetchDetailsProduct.pending, (state, action)=>{
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchDetailsProduct.fulfilled, (state, action)=>{
        state.productDetails = action.payload;
        state.loading = false;
        state.error = false;
      })
      .addCase(fetchDetailsProduct.rejected, (state, action)=>{
        state.loading = false;
        state.error= action.payload.message ? action.payload.message : action.payload;
      })
  },
});

//EXPORT REDUCER
export default productsSlice.reducer;