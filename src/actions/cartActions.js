import { ADD_TO_CART, REMOVE_ITEM, SUB_QUANTITY, ADD_QUANTITY, FETCH_CATALOG, CLEAR_CART, STORE_ORDERED, STORE_ORDER_ID } from './action-types/cart-actions'

//add cart action
export const fetchCatalog = (data) => {
    return {
        type: FETCH_CATALOG,
        data
    }
}
export const addToCart = (_id) => {
    return {
        type: ADD_TO_CART,
        _id
    }
}
//remove item action
export const removeItem = (_id) => {
    return {
        type: REMOVE_ITEM,
        _id
    }
}
//subtract qt action
export const subtractQuantity = (_id) => {
    return {
        type: SUB_QUANTITY,
        _id
    }
}
//add qt action
export const addQuantity = (_id) => {
    return {
        type: ADD_QUANTITY,
        _id
    }
}
export const clearCart = () => {
    return {
        type: CLEAR_CART,
        data: []
    }
}
export const storeOrderedItems = (data) => {
    return {
        type: STORE_ORDERED,
        data
    }
}
export const storeOrderId = (data) => {
    return {
        type: STORE_ORDER_ID,
        data
    }
}
