import React from "react";
import { Route, Routes } from "react-router";
import MainPage from "../pages/MainPage";
import Product from "../pages/Product";
import CartPage from "../pages/CardPage";

import Payment from "../pages/Payment";

import AddNewProduct from "../pages/AddNewProduct";
import Register from "../components/Auth/Register";
import AuthPage from "../pages/AuthPage";
import EditItem from "../components/EditItem/EditItem";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/edit/:id" element={<EditItem />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/add" element={<AddNewProduct />} />
      <Route path="/register" element={<AuthPage />} />
    </Routes>
  );
};

export default AppRoutes;
