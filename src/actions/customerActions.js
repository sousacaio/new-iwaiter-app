import {STORE_USER_INFO} from './action-types/customer-actions';

//add cart action
export const storeUserInfo = (data) => {
  return {
    type: STORE_USER_INFO,
    data,
  };
};
