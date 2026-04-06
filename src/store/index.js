import { configureStore } from "@reduxjs/toolkit";
import transactionsReducer from "./transactionsSlice";
import authReducer from "./authSlice";
import uiReducer from "./uiSlice";
import insightsReducer from "./insightsSlice";

export const store = configureStore({
  reducer: {
    transactions: transactionsReducer,
    auth: authReducer,
    ui: uiReducer,
    insights: insightsReducer,
  },
});
