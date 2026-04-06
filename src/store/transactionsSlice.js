import { createSlice } from "@reduxjs/toolkit";
import { mockTransactions } from "../utils/mockData";

const STORAGE_KEY = "zorvyn_transactions";

const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : mockTransactions;
  } catch {
    return mockTransactions;
  }
};

const saveToStorage = (transactions) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch {}
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState: {
    list: loadFromStorage(),
    searchQuery: "",
    filterCategory: "All",
    filterType: "All",
    sortBy: "date-desc",
  },
  reducers: {
    addTransaction: (state, action) => {
      state.list.unshift(action.payload);
      saveToStorage(state.list);
    },
    editTransaction: (state, action) => {
      const idx = state.list.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) {
        state.list[idx] = action.payload;
        saveToStorage(state.list);
      }
    },
    deleteTransaction: (state, action) => {
      state.list = state.list.filter((t) => t.id !== action.payload);
      saveToStorage(state.list);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setFilterCategory: (state, action) => {
      state.filterCategory = action.payload;
    },
    setFilterType: (state, action) => {
      state.filterType = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = "";
      state.filterCategory = "All";
      state.filterType = "All";
      state.sortBy = "date-desc";
    },
  },
});

export const {
  addTransaction,
  editTransaction,
  deleteTransaction,
  setSearchQuery,
  setFilterCategory,
  setFilterType,
  setSortBy,
  resetFilters,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;
