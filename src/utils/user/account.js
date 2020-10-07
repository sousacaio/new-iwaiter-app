/*eslint-disable*/
import api from '../../services/axios';
import AsyncStorage from '@react-native-community/async-storage';

export const updateUserAccount = async (type, data, id) => {
    try {
        console.log(data)
        const response = await api.put(`customers/${id}/update`, {
            data: data,
            type,
        });
        const { status, data: { message, success, data: newData } } = response;
        if (status === 200) {
            await AsyncStorage.setItem(type, data);
            return { success, newData, message }
        } else {
            return { success: false, newData: [], message: 'Houve um erro na requisição.Por favor,tente mais tarde.Erro 1' }
        }
    } catch (error) {
        return { success: false, newData: [], message: 'Houve um erro na requisição.Por favor,tente mais tarde.Erro 2', error }
    }
}