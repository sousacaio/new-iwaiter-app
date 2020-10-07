import React from 'react';
import styled from 'styled-components/native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useAuth} from '../services/authContext';
const TabArea = styled.View`
  height: 60px;
  background-color: #6200ee;
  flex-direction: row;
`;

const TabItem = styled.TouchableOpacity`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const TabItemCenter = styled.TouchableOpacity`
    flex:1;
    width:70px;
    height:70px;
    justify-content:center;
    align-items:center
    background-color:#FFF;
    border-radius:35px;
    border:3px solid #6200ee;
    margin-top:-20px;
`;
export default ({state, navigation}) => {
  console.log(state.index);
  const {status} = useAuth();
  const goTo = (screenName) => {
    navigation.navigate(screenName);
  };
  return (
    <TabArea>
      <TabItem onPress={() => goTo('Home')}>
        <AntDesign
          style={{opacity: state.index === 0 ? 1 : 0.5}}
          name="home"
          color="white"
          size={30}
        />
      </TabItem>
      {status === 'signOut' ? null : (
        <TabItemCenter onPress={() => goTo('Comanda')}>
          <AntDesign name="scan1" color="#6200ee" size={30} />
        </TabItemCenter>
      )}
      {status === 'signOut' ? (
        <TabItem onPress={() => goTo('Login')}>
          <AntDesign
            style={{opacity: state.index === 1 ? 1 : 0.5}}
            name="login"
            color="white"
            size={30}
          />
        </TabItem>
      ) : (
        <TabItem onPress={() => goTo('Conta')}>
          <AntDesign
            style={{opacity: state.index === 2 ? 1 : 0.5}}
            name="profile"
            color="white"
            size={30}
          />
        </TabItem>
      )}
    </TabArea>
  );
};
