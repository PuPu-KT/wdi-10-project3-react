import { getProduct } from '../reducers/productsReducer';

// actions
const CART_ADD   = 'cart/ADD';
const CART_REMOVE = 'cart/REMOVE';
const CART_REMOVE_ALL_BY_ID = 'cart/REMOVE_ALL_BY_ID';

const CART_REMOVE_ALL = 'cart/REMOVE_ALL';

// reducer
const initialState = {
    items: [], // array of product ids
    currency: '$'
};

export default function cart(state = initialState, action = {}) {
    switch (action.type) {
        case CART_ADD:
            return handleCartAdd(state, action.payload);
        case CART_REMOVE:
            return handleCartRemove(state, action.payload);
        case CART_REMOVE_ALL_BY_ID:
            return handleCartRemoveAllById(state, action.payload);
        case CART_REMOVE_ALL:
            console.log('switchswitchswitchswitchswitch');
            return handleCartRemoveAll(state);

        default:
            return state;
    }
}

function handleCartAdd(state, payload) {

  // find if item is in store with productId
  let itemFound = state.items.find((itm) => {
                    return itm.id === payload.productId
                  });

  // if array is empty or not found
  // state.items won't be null as state is initialized.
  if (state.items.length === 0 ||
      !itemFound) {
    state.items.push({
      id: payload.productId,
      qty: 1,
    });
  }
  else {
  //  find item & increase qty.
    state.items = state.items.map((itm) => {
      if (itm === itemFound) {
        itm.qty++;
      }
      return itm;
    });
  }
  return {...state};// if ... left out,
                    //  components subscribed to store
                    //  will not receive updates.
}

function handleCartRemove(state, payload) {
  // find item to dec(--) qty. if qty. becomes 0,
  // don't return item.
  state.items = state.items.filter((itm) => {
    if (itm.id === payload.productId) {
      //  if qty is 0, don't return item.
      itm.qty--;
      if (itm.qty === 0) {
        // eslint-disable-next-line
        return;
      }
    }
    return itm;
  });

  return {...state};
}

function handleCartRemoveAll(state) {
  state.items = [];
  return {...state};
}

function handleCartRemoveAllById(state, payload) {
  state.items = state.items.filter((itm)=> {
    return itm.id != payload.productId;
  });

  return {...state};  //  no clone, no update
}

// <editor-fold action creators
export function addToCart(productId) {
    return {
        type: CART_ADD,
        payload: {
            productId
        }
    }
}

export function removeFromCart(productId) {
    return {
        type: CART_REMOVE,
        payload: {
            productId
        }
    }
}

export function removeAllFromCart(productId) {
    return {
        type: CART_REMOVE_ALL_BY_ID,
        payload: {
            productId
        }
    }
}

export function removeAllItemsFromCart() {
    console.log('actionactionactionactionactionaction');
    return {
        type: CART_REMOVE_ALL,
        payload: {
        }
    }
}

// </editor-fold>

// <editor-fold selectors
export function isInCart(state, props) {
    return state.cart.items.indexOf(props.id) !== -1;
}

export function getItemQtyInCart(state, props) {
  try {
      const result = state.cart.items.find((itm) => {
        return itm.id === props.id;
      });
      if (result) {
        return result.qty;
      }else {
        return 0;
      }

  } catch (e) {
    console.log(e);
    return 0;
  }
}

export function getItems(state, props) {

    return state.cart.items.map(item =>{

      let theprod = getProduct(state, item );

      theprod = {...theprod, qty: item.qty, subtotal: (item.qty * item.price)};

      return theprod;
    });
}

export function getCurrency(state, props) {
    return state.cart.currency;
}

export function getTotal(state, props) {

    return state.cart.items.reduce((acc, cartItem) => {
        const item = getProduct(state, cartItem);
        // console.log(item);
        // console.log(cartItem);
        return acc + (cartItem.qty * item.price);
    }, 0);
}
// </editor-fold>
