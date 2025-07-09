// cartStorage.js
const getCart = () => {
  return JSON.parse(localStorage.getItem('cart')) || [];
};

const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
};

const addToCart = (item) => {
  const cart = getCart();
  const existingItemIndex = cart.findIndex(
    (i) => i.id === item.id && i.color === item.color && i.size === item.size
  );
  if (existingItemIndex !== -1) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  saveCart(cart);
};

const removeFromCart = (id, color, size) => {
  const cart = getCart();
  const newCart = cart.filter((item) => !(item.id === id && item.color === color && item.size === size));
  saveCart(newCart);
};

const updateQuantity = (index, quantity) => {
  const cart = getCart();
  if (quantity > 0) {
    cart[index].quantity = quantity;
    saveCart(cart);
  } else {
    removeFromCart(cart[index].id, cart[index].color, cart[index].size);
  }
};

export { getCart, addToCart, removeFromCart, updateQuantity };