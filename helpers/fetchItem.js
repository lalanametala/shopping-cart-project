const urlGenerator = (itemId) => `https://api.mercadolibre.com/items/${itemId}`;

const fetchItem = async (itemId) => {
  if (!itemId) {
    throw new Error('You must provide an url');
  }
  const url = urlGenerator(itemId);
  const result = await fetch(url);
  const data = await result.json();
  return data;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchItem,
  };
}
