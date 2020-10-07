import api from '../../services/axios';

export const bringAllEstablishments = async () => {
  try {
    const res = await api.get('establishment/all');
    //console.log(JSON.stringify(res, null, '\t'));
    const {
      data: {
        message,
        success,
        data: {establishments},
      },
    } = res;
    if (success) {
      return {establishments, success, message};
    } else {
      return {message, success};
    }
  } catch (error) {
    return {success: false, message: error};
  }
};
