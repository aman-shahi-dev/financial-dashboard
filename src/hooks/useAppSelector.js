import { useDispatch, useSelector } from "react-redux";

export const useAppSelector = (selector) => useSelector(selector);
export const useAppDispatch = () => useDispatch();
