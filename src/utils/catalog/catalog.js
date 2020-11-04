/* eslint-disable */
import api from '../../services/axios';
export const openCatalog = async (establishment, point) => {
  try {

    const response = await api.get(`orders/${establishment}/verify/${point}`);
    
    const {
      data: {
        success,
        message,
        data: { catalog },
      },
    } = response;
    if (success) {
      return { message, catalog, error1: true };
    } else {
      return { message, catalog: [], error1: true };
    }
  } catch (error) {
    return {
      message:
        'Houve um problema ao processar a sua requisição.Por favor,tente novamente.',
      catalog: [],
      error,
    };
  }
};
