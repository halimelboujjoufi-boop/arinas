"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  collection?: string;
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews?: number;
  badge?: string;
  description?: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  material?: string;
  brand?: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface StoreState {
  cart: CartItem[];
  wishlist: Product[];
  recentlyViewed: Product[];
  cartOpen: boolean;
  searchOpen: boolean;
  quickViewProduct: Product | null;
  language: "en" | "fr" | "ar";
  couponCode: string;
  couponDiscount: number;
}

type StoreAction =
  | { type: "ADD_TO_CART"; payload: CartItem }
  | { type: "REMOVE_FROM_CART"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "TOGGLE_WISHLIST"; payload: Product }
  | { type: "TOGGLE_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "TOGGLE_SEARCH" }
  | { type: "SET_QUICK_VIEW"; payload: Product | null }
  | { type: "SET_LANGUAGE"; payload: "en" | "fr" | "ar" }
  | { type: "ADD_RECENTLY_VIEWED"; payload: Product }
  | { type: "APPLY_COUPON"; payload: { code: string; discount: number } }
  | { type: "REMOVE_COUPON" };

function storeReducer(state: StoreState, action: StoreAction): StoreState {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existing = state.cart.find(
        (item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.selectedSize &&
          item.selectedColor === action.payload.selectedColor
      );
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id &&
            item.selectedSize === action.payload.selectedSize
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    case "TOGGLE_WISHLIST": {
      const inWishlist = state.wishlist.find((p) => p.id === action.payload.id);
      return {
        ...state,
        wishlist: inWishlist
          ? state.wishlist.filter((p) => p.id !== action.payload.id)
          : [...state.wishlist, action.payload],
      };
    }
    case "TOGGLE_CART":
      return { ...state, cartOpen: !state.cartOpen };
    case "OPEN_CART":
      return { ...state, cartOpen: true };
    case "CLOSE_CART":
      return { ...state, cartOpen: false };
    case "TOGGLE_SEARCH":
      return { ...state, searchOpen: !state.searchOpen };
    case "SET_QUICK_VIEW":
      return { ...state, quickViewProduct: action.payload };
    case "SET_LANGUAGE":
      return { ...state, language: action.payload };
    case "ADD_RECENTLY_VIEWED": {
      const without = state.recentlyViewed.filter((p) => p.id !== action.payload.id);
      return { ...state, recentlyViewed: [action.payload, ...without].slice(0, 8) };
    }
    case "APPLY_COUPON":
      return { ...state, couponCode: action.payload.code, couponDiscount: action.payload.discount };
    case "REMOVE_COUPON":
      return { ...state, couponCode: "", couponDiscount: 0 };
    default:
      return state;
  }
}

const StoreContext = createContext<{
  state: StoreState;
  dispatch: React.Dispatch<StoreAction>;
} | null>(null);

const INITIAL_STATE: StoreState = {
  cart: [],
  wishlist: [],
  recentlyViewed: [],
  cartOpen: false,
  searchOpen: false,
  quickViewProduct: null,
  language: "en",
  couponCode: "",
  couponDiscount: 0,
};

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(storeReducer, INITIAL_STATE);

  // Persist cart and wishlist
  useEffect(() => {
    try {
      const saved = localStorage.getItem("arinas_store");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.cart) parsed.cart.forEach((item: CartItem) => dispatch({ type: "ADD_TO_CART", payload: item }));
        if (parsed.wishlist) parsed.wishlist.forEach((item: Product) => dispatch({ type: "TOGGLE_WISHLIST", payload: item }));
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("arinas_store", JSON.stringify({ cart: state.cart, wishlist: state.wishlist }));
    } catch {}
  }, [state.cart, state.wishlist]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function useCartTotal(cart: CartItem[], discount = 0) {
  const sub = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return sub - discount;
}
