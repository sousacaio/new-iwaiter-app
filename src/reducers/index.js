import { combineReducers } from 'redux';
import customerReducer from './customerReducer'
import cartReducer from './cartReducer';
const rootReducer = combineReducers({
    cart: cartReducer,
    customer: customerReducer
});

export default rootReducer;