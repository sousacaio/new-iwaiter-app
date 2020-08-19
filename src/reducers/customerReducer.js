import {
    STORE_USER_INFO
} from '../actions/action-types/customer-actions'

const initState = {
    lastOrders: [],
    name: '',
    email: '',
    id: '',
    createdAt: '',
    photo: ''
}
const customerReducer = (state = initState, action) => {
    if (action.type === STORE_USER_INFO) {
        return {
            ...state,
            lastOrders: action.data.lastOrders,
            name: action.data.name,
            email: action.data.email,
            id: action.data.id,
            createdAt: action.data.createdAt,
            photo: action.data.photo,
        }
    }
    return state;
}

export default customerReducer
