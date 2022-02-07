const urlBuilder = (products) => `https://api.mercadolibre.com/sites/MLB/search?q=${products}`;

const fetchProducts = async (products) => {
  if (!products) {
    throw new Error('You must provide an url');
  }
  const result = await fetch(urlBuilder(products));
  const data = await result.json();
  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}
