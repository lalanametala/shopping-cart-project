const itemsSection = document.querySelector('.items');
const cartItems = document.querySelector('.cart__items');
const emptyCartBtn = document.querySelector('.empty-cart');
const cart = document.querySelector('.cart');

const createTotalPriceElement = () => {
  const priceElement = document.createElement('p');
  priceElement.innerText = 'Preço total: $';
  priceElement.className = 'price';
  cart.appendChild(priceElement);
  const totalPriceSpan = document.createElement('span');
  totalPriceSpan.className = 'total-price';
  totalPriceSpan.innerText = 0;
  priceElement.appendChild(totalPriceSpan);
};

createTotalPriceElement();
const totalPriceEl = document.querySelector('.total-price');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

// função para alterar o preço total
const calculateTotalPrice = (price, operation) => {
  const previousPrice = parseFloat(totalPriceEl.innerText);
  const newValue = parseFloat(price);
  let result = 0;
  if (operation === 'sum') result = (previousPrice + newValue).toPrecision();
  else if (operation === 'sub') result = (previousPrice - newValue).toPrecision();
  totalPriceEl.innerHTML = result;
};

// função para extrair o preço de um cart item (que é uma string)
const extractPrice = (item) => {
  const splittedItem = item.innerText.split('$');
  return splittedItem[splittedItem.length - 1];
};

function cartItemClickListener(event) {
  const removedItem = cartItems.removeChild(event.target);
  calculateTotalPrice(extractPrice(removedItem), 'sub');  
  saveCartItems(cartItems.innerHTML);
}

// Alteração de getElementsByClassName + Array.from para querySelectorAll, pois a nodelist já funciona como array, por dica da colega Verônica Alves
const removeCartItemEventPlacer = () => {
  const allItems = document.querySelectorAll('.cart__item');
  allItems.forEach((item) => item.addEventListener('click', cartItemClickListener));  
};

// Alteração de children + Array.from para childNodes, pois a nodelist já funciona como array, por dica da colega Verônica Alves
const loadLocalStorage = () => {
  cartItems.innerHTML = getSavedCartItems();
  const itemsList = cartItems.childNodes;
  itemsList.forEach((curr) => {
    calculateTotalPrice(extractPrice(curr), 'sum');
  });
  removeCartItemEventPlacer();
};

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

const getResultsArray = async () => {
  const products = await fetchProducts('computer');
  const { results } = products;
  return results;
};

const appendProducts = (array) => array.forEach((product) => {
  const newElement = createProductItemElement(product);
  itemsSection.appendChild(newElement);
});

const itemButtonClickListener = async (event) => {
  const parent = event.target.parentNode;
  const id = getSkuFromProductItem(parent);
  const item = await fetchItem(id);
  calculateTotalPrice(item.price, 'sum');
  const newElement = createCartItemElement(item);
  cartItems.appendChild(newElement);
  saveCartItems(cartItems.innerHTML);
};

// Alteração de getElementsByClassName + Array.from para querySelectorAll, pois a nodelist já funciona como array, por dica da colega Verônica Alves
const clickItemButton = async () => {
  const addButtons = document.querySelectorAll('.item__add');
  addButtons.forEach((button) => button.addEventListener('click', itemButtonClickListener));
};

const emptyCart = () => {
  for (let index = cartItems.childNodes.length - 1; index >= 0; index -= 1) {
    cartItems.firstChild.remove();
  }
  totalPriceEl.innerHTML = 0;
  saveCartItems(cartItems.innerHTML);
};

window.onload = async () => {  
  const resultsArray = await getResultsArray();
  appendProducts(resultsArray);
  itemsSection.firstElementChild.remove();  
  await clickItemButton();
  emptyCartBtn.addEventListener('click', emptyCart);  
  loadLocalStorage();
};
