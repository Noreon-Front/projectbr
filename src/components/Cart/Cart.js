import React, { useEffect } from "react";
import { useProducts } from "../../contexts/ProductsContext";
import { calcTotalPrice } from "../../utils/calc";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import MyLink from "../../shared/MyLink";
import { IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const Cart = () => {
  const { cart, getCart, changeProductCount, deleteProductFromCart } = useProducts();

  useEffect(() => {
    getCart();
  }, []);
  console.log(cart.product);
  const classes = useStyles();

  const handleCountChange = ({ value }, id) => {
    changeProductCount(value, id);
  };

  return (
    <div>
      {cart && cart.products ? (
        <>
          {
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="caption table">
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <h2>Your shopping list</h2>
                    </TableCell>

                    <TableCell align="center">Image</TableCell>

                    <TableCell align="center">Price</TableCell>
                    <TableCell align="center">Count</TableCell>
                    <TableCell align="center">SubTotal</TableCell>
                    <TableCell align="center">Delete an item</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cart.products.map((item) => (
                    <TableRow key={item.product.id}>
                      <TableCell component="th" scope="">
                        {item.product.title}
                      </TableCell>
                      <TableCell align="center">
                        <img src={item.product.image} alt="" style={{ width: "100px" }} />
                      </TableCell>

                      <TableCell align="center">{item.product.price}</TableCell>
                      <TableCell align="center">
                        <input type="number" value={item.count} onChange={(e) => handleCountChange(e.target, item.product.id)} />
                      </TableCell>

                      <TableCell align="center">{item.subPrice}</TableCell>
                      <TableCell align="center">
                        <IconButton align="center" onClick={() => deleteProductFromCart(item.product)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: "100px",
                    padding: "10px",
                  }}
                >
                  <h3 align="center">Total : {calcTotalPrice(cart.products)}</h3>
                  <MyLink to="/payment">
                    <Button variant="contained" color="secondary">
                      Оплатить
                    </Button>
                  </MyLink>
                </div>
              </Table>
            </TableContainer>
          }
          {/* <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Count</th>
                <th>Sub Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.products.map((item) => (
                <tr key={item.product.id}>
                  <td>
                    <img
                      src={item.product.image}
                      alt=""
                      style={{ width: "150px" }}
                    />
                  </td>
                  <td>{item.product.title}</td>
                  <td>{item.product.price}</td>
                  <td>
                    <input type="number" value={item.count} />
                  </td>
                  <td>{item.subPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>Total: {calcTotalPrice(cart.products)}</h4>
          <button>Оплатить</button> */}
        </>
      ) : (
        <h1>Cart is empty</h1>
      )}
    </div>
  );
};

export default Cart;
