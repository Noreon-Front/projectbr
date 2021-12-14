import { Grid, IconButton } from "@material-ui/core";
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { Shop } from "@material-ui/icons";
import MyLink from "../../shared/MyLink";
import { useProducts } from "../../contexts/ProductsContext";
import { checkItemInCart } from "../../utils/check-item-cart";

const useStyles = makeStyles({
  root: {
    maxWidth: "100%",
  },
  media: {
    height: 300,
    backgroundSize: "contain",
  },
  actions: {
    justifyContent: "space-between",
  },
});

const ProductCard = ({ product, cart }) => {
  const classes = useStyles();
  const { addAndDeleteProductInCart } = useProducts();
  const isItemInCart = () => {
    if (cart) {
      return checkItemInCart(cart.products, product.id);
    }
    return false;
  };

  return (
    <Card className={classes.root}>
      <MyLink to={`/product/${product.id}`}>
        <CardActionArea>
          <CardMedia className={classes.media} image={product.image} title="Contemplative Reptile" />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {product.title}
            </Typography>
            <Typography variant="body2" gutterBottom color="textSecondary" component="p">
              {product.description}
            </Typography>
            <Typography variant="subtitle1" color="textPrimary" component="p">
              Цена: {product.price} сом
            </Typography>
            <Typography variant="subtitle1" color="textPrimary" component="p">
              В наличии: {product.countInStock} шт
            </Typography>
          </CardContent>
        </CardActionArea>
      </MyLink>
      <CardActions className={classes.actions}>
        <IconButton color={isItemInCart() ? "secondary" : ""}>
          <ShoppingCartIcon />
        </IconButton>
        <Button
          onClick={() => addAndDeleteProductInCart(product)}
          style={{ backgroundColor: "#ff8800" }}
          variant="contained"
          startIcon={<Shop />}
        >
          Купить
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
