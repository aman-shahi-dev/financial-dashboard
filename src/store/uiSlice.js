import { createSlice } from "@reduxjs/toolkit";

const getInitialSidebarState = () => {
  if (typeof window === "undefined") return true;
  return window.innerWidth > 768;
};

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "dark",
    isSidebarOpen: getInitialSidebarState(),
    isModalOpen: false,
    editingTransaction: null,
  },
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    setSidebar: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    openModal: (state, action) => {
      state.isModalOpen = true;
      state.editingTransaction = action.payload ?? null;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.editingTransaction = null;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleSidebar,
  setSidebar,
  openModal,
  closeModal,
} = uiSlice.actions;
export default uiSlice.reducer;
