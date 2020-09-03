/* eslint-disable prettier/prettier */
import {
    ADD_TO_CART,
    REMOVE_ITEM,
    SUB_QUANTITY,
    ADD_QUANTITY,
    FETCH_CATALOG,
    CLEAR_CART,
    STORE_ORDERED,
    STORE_ORDER_ID,
    FINISH_ORDER,
} from '../actions/action-types/cart-actions';

const initState = {
    items: [],
    addedItems: [],
    orderedItems: [],
    total: 0,
    totalCart: 0,
    totalOrder: 0,
    hasOrdered: false,
    isFirstOrder: true,
    orderId: '',
};
const cartReducer = (state = initState, action) => {
    //INSIDE HOME COMPONENT
    if (action.type === FINISH_ORDER) {
        return {
            ...state,
            items: [],
            addedItems: [],
            orderedItems: [],
            total: 0,
            totalCart: 0,
            totalOrder: 0,
            hasOrdered: false,
            isFirstOrder: true,
            orderId: '',
        };
    }
    if (action.type === STORE_ORDER_ID) {
        return { ...state, orderId: action.data };
    }
    if (action.type === CLEAR_CART) {
        return {
            ...state,
            addedItems: action.data,
            totalCart: 0,
            isFirstOrder: false,
        };
    }
    if (action.type === FETCH_CATALOG) {
        return { ...state, items: action.data };
    }
    if (action.type === STORE_ORDERED) {
        return { ...state, orderedItems: action.data, isFirstOrder: false };
    }
    if (action.type === ADD_TO_CART) {
        let addedItem = state.items.find((item) => item._id === action._id);
        //check if the action id exists in the addedItems
        let existed_item = state.addedItems.find((item) => action._id === item._id);

        if (existed_item) {
            addedItem.quantity += 1;
            return {
                ...state,
                total: state.total + addedItem.value,
                totalCart: state.total + addedItem.value,
            };
        } else {
            addedItem.quantity = 1;
            //calculating the total
            let newTotal = state.total + addedItem.value;

            return {
                ...state,
                addedItems: [...state.addedItems, addedItem],
                total: newTotal,
                totalCart: newTotal,
            };
        }
    }
    if (action.type === REMOVE_ITEM) {
        let itemToRemove = state.addedItems.find((item) => action._id === item._id);
        let new_items = state.addedItems.filter((item) => action._id !== item._id);
        //calculating the total
        let newTotal = state.total - itemToRemove.price * itemToRemove.quantity;

        return {
            ...state,
            addedItems: new_items,
            total: newTotal,
            totalCart: newTotal,
        };
    }
    //INS_IDE CART COMPONENT
    if (action.type === ADD_QUANTITY) {
        let addedItem = state.items.find((item) => item._id === action._id);
        addedItem.quantity += 1;
        let newTotal = state.total + addedItem.value;
        return {
            ...state,
            total: newTotal,
            totalCart: newTotal,
        };
    }
    if (action.type === SUB_QUANTITY) {
        let addedItem = state.items.find((item) => item._id === action._id);
        //if the qt == 0 then it should be removed

        if (addedItem.quantity === 1) {
            let new_items = state.addedItems.filter(
                (item) => item._id !== action._id,
            );
            let newTotal = state.total - addedItem.value;
            return {
                ...state,
                addedItems: new_items,
                total: newTotal,
                totalCart: newTotal,
            };
        } else {
            addedItem.quantity -= 1;
            let newTotal = state.total - addedItem.value;
            return {
                ...state,
                total: newTotal,
                totalCart: newTotal,
            };
        }
    }

    return state;
};

export default cartReducer;
