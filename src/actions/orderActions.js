import { saveEstablishmentAndPoint } from './action-types/order-actions'

//add cart action
export const saveEstablishmentAndPoint = (data) => {
    return {
        type: SAVE_ESTABLISHMENT_AND_POINT,
        data
    }
}

