/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, FlatList, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RenderEstablishments from './RenderEstablishments';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import { bringAllEstablishments } from '../../utils/home/home';
import { TouchableOpacity } from 'react-native-gesture-handler';
const Home = (props) => {
  const navigation = useNavigation();

  async function checkCredentials() {
    const est = await AsyncStorage.getItem('id_establishment');
    const point = await AsyncStorage.getItem('id_point');
    if (est && point) {
      navigation.navigate('Comanda', {
        screen: 'Scan',
        params: {
          id_establishment: est,
          id_point: point,
        },
      });
    }
  }

  const doBringAllEst = async () => {
    const res = await bringAllEstablishments();
    // console.log(JSON.stringify(res, null, '\t'));
    const { success, establishments, message } = res;
    if (success) {
      // console.log(JSON.stringify(establishments, null, '\t'));
      setEstInfo(establishments);
    } else {
      ToastAndroid.show(message, ToastAndroid.LONG, ToastAndroid.BOTTOM);
    }
  };
  useEffect(() => {
    checkCredentials();
    doBringAllEst();
  }, []);

  const [estInfo, setEstInfo] = useState([]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, margin: 10 }}>
        <Text style={{ fontSize: 30 }}>Restaurantes parceiros:</Text>
        <FlatList
          data={estInfo}
          renderItem={(item) => {
            return (
              <TouchableOpacity onPress={()=>navigation.navigate('DetailEstablishment',{item:item.item})}>
                <RenderEstablishments name={item.item.name} />
              </TouchableOpacity>)
          }}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};
export default Home;
