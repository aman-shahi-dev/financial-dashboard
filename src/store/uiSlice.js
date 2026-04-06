import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    theme: "dark",
    isSidebarOpen: false,
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

export const { toggleTheme, setTheme, toggleSidebar, openModal, closeModal } =
  uiSlice.actions;
export default uiSlice.reducer;
