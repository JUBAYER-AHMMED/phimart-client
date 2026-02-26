import { useCallback, useEffect, useState } from "react";
import authApiClient from "../services/auth-api-client";

const useCart = () => {
  // const [authToken] = useState(
  //   () => JSON.parse(localStorage.getItem("authTokens")).access
  // );
  const authTokens = JSON.parse(localStorage.getItem("authTokens") || "null");
  const [cart, setCart] = useState(null);
  const [cartId, setCartId] = useState(() => localStorage.getItem("cartId"));
  const [loading, setLoading] = useState(false);

 const createOrGetCart = useCallback(async () => {
  if (cartId) {
    try {
      const res = await authApiClient.get(`/carts/${cartId}/`);
      setCart(res.data);
      return;
    } catch (e) {
      localStorage.removeItem("cartId");
      setCartId(null);
    }
  }

  setLoading(true);
  try {
  const response = await authApiClient.post("/carts/", {});
  console.log("Cart created successfully:", response.data);
  localStorage.setItem("cartId", response.data.id);
  setCartId(response.data.id);
  setCart(response.data);
} catch (error) {
  console.error("Cart creation failed with status:", error.response?.status);
  console.error("Full response data from server:", error.response?.data);
  console.error("Full error object:", error);
}finally {
    setLoading(false);
  }
}, [cartId]);


  const AddCartItems = useCallback(
  async (product_id, quantity) => {
    setLoading(true);

    let currentCartId = cartId;

    if (!currentCartId) {
      const response = await authApiClient.post("/carts/");
      currentCartId = response.data.id;
      localStorage.setItem("cartId", currentCartId);
      setCartId(currentCartId);
    }

    try {
      const response = await authApiClient.post(
        `/carts/${currentCartId}/items/`,
        { product_id, quantity }
      );
      return response.data;
    } catch (error) {
      console.log("Error adding Items", error);
    } finally {
      setLoading(false);
    }
  },
  [cartId]
);

  const updateCartItemQuantity = useCallback(
    async (itemId, quantity) => {
      try {
        await authApiClient.patch(`/carts/${cartId}/items/${itemId}/`, {
          quantity,
        });
      } catch (error) {
        console.log("Error updating cart items", error);
      }
    },
    [cartId]
  );

  const deleteCartItems = useCallback(
    async (itemId) => {
      try {
        await authApiClient.delete(`/carts/${cartId}/items/${itemId}/`);
      } catch (error) {
        console.log(error);
      }
    },
    [cartId]
  );

  


 useEffect(() => {
  const initializeCart = async () => {
    setLoading(true);
    await createOrGetCart();
    setLoading(false);
  };
  initializeCart();
}, []); 
  return {
    cart,
    loading,
    createOrGetCart,
    AddCartItems,
    updateCartItemQuantity,
    deleteCartItems,
  };
};

export default useCart;