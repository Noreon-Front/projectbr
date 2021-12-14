import { Button, Grid, Paper } from "@material-ui/core";
import React, { useState } from "react";

import "./AddProduct.css";
import { useNavigate } from "react-router";
import { useProducts } from "../../contexts/ProductsContext";

const AddProduct = () => {
  const { addProduct } = useProducts();
  const [form, setForm] = useState({
    title: "",
    image: "",
    price: "",
    description: "",
    phone: "",
    countInStock: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const values = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(values);
  };

  const addPhone = async () => {
    if (!form.title || !form.image || !form.price || !form.description || !form.phone || !form.countInStock) {
      alert("fill all blanks");
      return;
    }
    await addProduct(form);
    // navigate("/");
  };
  //   console.log(form);
  return (
    <>
      <h1>Add new Sneaker</h1>
      <Grid container className="main">
        <Grid item md={5}>
          <Paper elevation={5} className="paper">
            <form className="inp">
              <input type="text" placeholder="Title" name="title" value={form.title} onChange={handleChange} />
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
              <input type="text" placeholder="Image" name="image" onChange={handleChange} value={form.image} />
              <input type="text" placeholder="Price" name="price" onChange={handleChange} value={form.price} />
              <input type="text" placeholder="Phone" name="phone" onChange={handleChange} value={form.phone} />
              <input
                type="text"
                placeholder="Count in stock"
                name="countInStock"
                onChange={handleChange}
                value={form.countInStock}
              />
            </form>
            <Button onClick={addPhone} variant="contained" color="secondary" className="btn-add">
              Add a new Sneaker
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default AddProduct;
