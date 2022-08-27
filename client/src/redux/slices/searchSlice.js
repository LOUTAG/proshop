import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// @desc fetch product by term (Async)
export const fetchProductsByTerm = createAsyncThunk(
  "search/products/term",
  async (term, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await axios.get(`/api/products/search/${term}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState={
    searchProduct:[]
}
const searchSlice = createSlice({
    name: "search",
    initialState: initialState,
    extraReducers: (builder)=>{
        builder
            .addCase(fetchProductsByTerm.pending, (state, action)=>{
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchProductsByTerm.fulfilled, (state, action)=>{
                state.loading = false;
                state.searchProduct=action.payload;
            })
            .addCase(fetchProductsByTerm.rejected, (state, action)=>{
                state.loading= false;
                state.error = action.payload.message;
            })
    }
})
export default searchSlice.reducer;