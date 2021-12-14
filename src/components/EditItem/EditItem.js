import { Grid, Paper, Button } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import { blueGrey } from "@material-ui/core/colors";
import { useProducts } from "../../contexts/ProductsContext";

const EditItem = () => {
  const { productDetails, fetchOneProduct, editItem } = useProducts();
  console.log(productDetails);
  const [form, setForm] = useState({
    title: "",
    image: "",
    phone: "",
    price: "",
    description: "",
    countInStock: "",
  });

  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchOneProduct(id);
  }, []);

  useEffect(() => {
    setForm({
      title: "",
      image: "",
      phone: "",
      price: "",
      description: "",
      countInStock: "",
    });
  }, [productDetails]);

  const handleChange = (e) => {
    const values = {
      ...form,
      [e.target.name]: e.target.value,
    };
    setForm(values);
  };

  const handleEdit = () => {
    editItem({ ...form, id });
    navigate("/");
  };
  return (
    <>
      <h1 align="center">Edit my product</h1>

      <Grid container className="main">
        <Grid item md={5}>
          <Paper className="paper">
            <form action="">
              <input type="text" placeholder="Title" name="title" onChange={handleChange} value={form.title} />
              <textarea
                type="text"
                placeholder="Description"
                name="description"
                onChange={handleChange}
                value={form.description}
              />
              <input type="text" placeholder="Image" name="image" onChange={handleChange} value={form.image} />
              <input type="text" placeholder="Phone" name="phone" onChange={handleChange} value={form.phone} />
              <input type="text" placeholder="Price" name="price" onChange={handleChange} value={form.price} />
              <input
                type="text"
                placeholder="countInStock"
                name="countInStock"
                onChange={handleChange}
                value={form.countInStock}
              />
              <Button variant="contained" style={{ backgroundColor: blueGrey[500] }} className="btn-add" onClick={handleEdit}>
                Save changes
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default EditItem;
