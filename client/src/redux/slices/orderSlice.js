import { createAsyncThunk, createSlice, createAction } from "@reduxjs/toolkit";
import instance from "../../utils/api";

export const createOrderAction = createAsyncThunk(
  "orders/create",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await instance.post("/api/orders", payload);
      dispatch(resetCreateOrderAction(response.data._id));
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const resetCreateOrderAction = createAction("order/reset");

export const orderDetailsAction = createAsyncThunk(
  "orders/details",
  async (id, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await instance.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderPayAction = createAsyncThunk(
  "orders/pay",
  async (payload, { rejectWithValue, getState, dispatch }) => {
    try {
      const response = await instance.put(
        `/api/orders/${payload.id}`,
        payload.paymentResult
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const orderInvoiceAction = createAsyncThunk(
  "orders/invoice",
  async(payload, {rejectWithValue, getState, dispatch})=>{
    try{
      const response = await instance.post('/api/orders/create-invoice', payload);
      return response.data;
    }catch(error){
      return rejectWithValue(error.response.data);
    }
  }
)

const initialState = {
  orderDetails: {},
  isOrderPaid: false,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    payResetAction: (state, action) => {
      state.isOrderPaid = false;
    },
    resetOrderAction: (state, action)=>{
      state.error = false;
      state.invoiceError = false;
      state.invoice= false;
      state.orderDetails={}
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAction.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(resetCreateOrderAction, (state, action) => {
        state.isOrderCreated = action.payload;
      })
      .addCase(createOrderAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.isOrderCreated = false;
      })
      .addCase(createOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(orderDetailsAction.pending, (state, action) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(orderDetailsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.error = false;
        state.orderDetails = action.payload;
      })
      .addCase(orderDetailsAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
    builder
      .addCase(orderPayAction.pending, (state, action) => {
        state.loadingPay = true;
        state.isOrderPaid = false;
        state.error = false;
      })
      .addCase(orderPayAction.fulfilled, (state, action) => {
        state.loadingPay = false;
        state.isOrderPaid = true;
      })
      .addCase(orderPayAction.rejected, (state, action) => {
        state.loadingPay = false;
        state.error = true;
      });
      builder
      .addCase(orderInvoiceAction.pending, (state, action)=>{
        state.invoiceLoading = true;
        state.invoiceError = false;
        state.invoice = false;
      })
      .addCase(orderInvoiceAction.fulfilled, (state, action)=>{
        state.invoiceLoading= false;
        state.invoice = action.payload;
      })
      .addCase(orderInvoiceAction.rejected, (state, action)=>{
        state.invoiceLoading=false;
        state.invoiceError=action.payload.message;
      })
  },
});
export const { payResetAction, resetOrderAction } = orderSlice.actions;
export default orderSlice.reducer;
