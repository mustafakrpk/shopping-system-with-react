import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getCategories } from "../../redux/actions/categoryActions";
import { saveProduct } from "../../redux/actions/productActions";
import ProductDetail from "./ProductDetail";

function AddOrUpdateProduct({
  products,
  categories,
  getCategories,
  saveProduct,
  ...props
}) {
  const [product, setProduct] = useState({ ...props.product });
  const [errors, setErrors] = useState({});
  const { productId } = useParams(); // Use useParams to get productId
  const navigate = useNavigate(); // Use useNavigate for navigation

  useEffect(() => {
    if (categories.length === 0) {
      getCategories();
    }
    if (productId && products.length > 0) {
      setProduct(getProductById(products, productId));
    }
  }, [productId, products, categories.length, getCategories]);

  function handleChange(event) {
    const { name, value } = event.target;
    setProduct((previousProduct) => ({
      ...previousProduct,
      [name]: name === "categoryId" ? parseInt(value, 10) : value,
    }));
    validateForm(name, value);
  }

  function validateForm(name, value) {
    if (name === "productName" && value === "") {
      setErrors((previousErrors) => ({
        ...previousErrors,
        productName: "Ürün ismi olmalıdır",
      }));
    } else {
      setErrors((previousErrors) => ({
        ...previousErrors,
        productName: "",
      }));
    }
  }

  function handleSave(event) {
    event.preventDefault();
    saveProduct(product).then(() => {
      navigate("/"); // Use navigate instead of history.push
    });
  }

  return (
    <ProductDetail
      product={product}
      categories={categories}
      onChange={handleChange}
      onSave={handleSave}
      errors={errors}
    />
  );
}

export function getProductById(products, productId) {
  return products.find((product) => product.id === parseInt(productId)) || {};
}

function mapStateToProps(state, ownProps) {
  const productId = ownProps.match ? ownProps.match.params.productId : null;
  const product =
    productId && state.productListReducer.length > 0
      ? getProductById(state.productListReducer, productId)
      : {};
  return {
    product,
    products: state.productListReducer,
    categories: state.categoryListReducer,
  };
}

const mapDispatchToProps = {
  getCategories,
  saveProduct,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddOrUpdateProduct);
