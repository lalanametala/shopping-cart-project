const saveCartItems = (completeCart) => {
  localStorage.setItem('cartItems', completeCart); 
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
