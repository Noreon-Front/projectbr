import axios from "axios";
import React, { createContext, useContext, useReducer } from "react";
import { useLocation, useNavigate } from "react-router";
import { $api, API } from "../service/axios-config";
import { calcSubPrice, calcTotalPrice } from "../utils/calc";
import { checkItemInCart } from "../utils/check-item-cart";
import {
  ADD_AND_DELETE_PRODUCT_IN_CART,
  GET_CART,
  GET_PRODUCTS_ERROR,
  GET_PRODUCTS_LOADING,
  GET_PRODUCTS_SUCCESS,
  GET_PRODUCT_ERROR,
  GET_PRODUCT_LOADING,
  GET_PRODUCT_SUCCESS,
  SET_SEARCH_RESULTS,
} from "../utils/constants";
import { productError, productLoading, productSuccess } from "./actions/productDetailsActions";
import { productsError, productsLoading, productsSuccess, setSearchResults } from "./actions/productsActions";

const productsContext = createContext();

export const useProducts = () => useContext(productsContext);

const initialState = {
  loading: false,
  error: null,
  products: [],
  productDetails: {
    loading: false,
    error: null,
    product: null,
  },
  cartData: JSON.parse(localStorage.getItem("cart")) ? JSON.parse(localStorage.getItem("cart")).products.length : 0,
  cart: {},
  searchResults: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case GET_PRODUCTS_LOADING:
      return { ...state, loading: true };

    case GET_PRODUCTS_ERROR:
      return { ...state, loading: false, products: [], error: action.payload };

    case GET_PRODUCTS_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        products: action.payload,
      };

    case GET_PRODUCT_LOADING:
      return {
        ...state,
        productDetails: { ...state.productDetails, loading: true },
      };

    case GET_PRODUCT_SUCCESS:
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          loading: false,
          error: null,
          product: action.payload,
        },
      };

    case GET_PRODUCT_ERROR:
      return {
        ...state,
        productDetails: {
          ...state.productDetails,
          loading: false,
          error: action.payload,
          product: null,
        },
      };

    case ADD_AND_DELETE_PRODUCT_IN_CART: {
      return {
        ...state,
        cartData: action.payload,
      };
    }
    case GET_CART: {
      return {
        ...state,
        cart: action.payload,
      };
    }

    case SET_SEARCH_RESULTS: {
      return {
        ...state,
        searchResults: action.payload,
      };
    }

    default:
      return state;
  }
};

const ProductsContext = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const location = useLocation();

  const navigate = useNavigate();

  const fetchProducts = async () => {
    dispatch(productsLoading());
    try {
      const { data } = await $api(`${window.location.search}`);
      setTimeout(() => {
        dispatch(productsSuccess(data));
      }, 2000);
    } catch (error) {
      console.log(error.message);
      dispatch(productsError(error.message));
    }
  };

  const deleteProductFromCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    const isItemInCart = checkItemInCart(cart.products, product.id);
    if (isItemInCart) {
      cart.products = cart.products.filter((item) => {
        return item.product.id !== product.id;
      });
    }
    cart.totalPrice = calcTotalPrice(cart.products);

    console.log(cart, "cart");
    localStorage.setItem("cart", JSON.stringify(cart));
    getCart();
    dispatch({
      type: ADD_AND_DELETE_PRODUCT_IN_CART,
      payload: cart.products.length,
    });
  };

  const fetchOneProduct = async (id) => {
    dispatch(productLoading());
    try {
      const { data } = await $api(`/${id}`);
      dispatch(productSuccess(data));
    } catch (error) {
      console.log(error.message);
      dispatch(productError(error.message));
    }
  };

  const addAndDeleteProductInCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart"));
    if (!cart) {
      cart = {
        products: [],
        totalPrice: 0,
      };
    }
    let newProduct = {
      count: 1,
      subPrice: 0,
      product: product,
    };
    console.log(newProduct);
    newProduct.subPrice = calcSubPrice(newProduct);

    //DELETE from cart
    // let newCart = cart.products.filter(
    //   (item) => item.product.id === product.id
    // );
    const isItemInCart = checkItemInCart(cart.products, product.id);
    if (isItemInCart) {
      cart.products = cart.products.filter((item) => item.product.id !== product.id);
    } else {
      cart.products.push(newProduct);
    }
    cart.totalPrice = calcTotalPrice(cart.products);

    console.log(cart, "cart");
    localStorage.setItem("cart", JSON.stringify(cart));
    dispatch({
      type: ADD_AND_DELETE_PRODUCT_IN_CART,
      payload: cart.products.length,
    });
  };

  const getCart = () => {
    let cartFromLS = JSON.parse(localStorage.getItem("cart"));
    dispatch({
      type: GET_CART,
      payload: cartFromLS,
    });
    console.log(cartFromLS);
  };

  const changeProductCount = (newCount, id) => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    cart.products = cart.products.map((item) => {
      if (item.product.id === id) {
        item.count = newCount;
        item.subPrice = calcSubPrice(item);
      }
      return item;
    });
    cart.totalPrice = calcTotalPrice(cart.products);
    localStorage.setItem("cart", JSON.stringify(cart));
    getCart();
  };

  const fetchByParams = async (query, value) => {
    const search = new URLSearchParams(location.search);

    if (value === "all") {
      search.delete(query);
    } else if (Array.isArray(value)) {
      search.set("price_gte", value[0]);
      search.set("price_lte", value[1]);
    } else {
      search.set(query, value);
    }

    // console.log(search.toString());
    const url = `${location.pathname}?${search.toString()}`;
    navigate(url);

    // const { data } = await $api(``);
    // dispatch(productsSuccess(data));
  };

  const fetchSearchProducts = async (value) => {
    try {
      if (!value) {
        dispatch(setSearchResults([]));
        return;
      }
      const { data } = await $api(`?q=${value}`);
      // console.log(data);
      dispatch(setSearchResults(data));
    } catch (e) {
      console.log(e.message);
    }
  };

  const addProduct = async (newProduct) => {
    console.log(newProduct);

    try {
      await $api.post("/", newProduct);
    } catch (error) {
      console.log(error.message);
    }
  };

  const editItem = (item) => {
    try {
      return $api.patch(`/${item.id}`, item);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await $api.delete(`/${id}`);
    } catch (e) {
      console.log(e.message);
    }
  };
  const values = {
    products: state.products,
    loading: state.loading,
    error: state.error,
    productDetailsLoading: state.productDetails.loading,
    productDetails: state.productDetails.product,
    productDetailsError: state.productDetails.error,
    cartData: state.cartData,
    cart: state.cart,
    searchResults: state.searchResults,
    fetchProducts,
    fetchOneProduct,
    addAndDeleteProductInCart,
    getCart,
    changeProductCount,
    fetchByParams,
    fetchSearchProducts,
    addProduct,
    deleteProduct,
    deleteProductFromCart,
    editItem,
  };

  return <productsContext.Provider value={values}>{children}</productsContext.Provider>;
};

export default ProductsContext;
