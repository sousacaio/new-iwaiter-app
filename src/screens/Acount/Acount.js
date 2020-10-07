import React, {useState} from 'react';
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-community/async-storage';
import MailIcon from 'react-native-vector-icons/Fontisto';
import Pass from 'react-native-vector-icons/Entypo';
import Edit from 'react-native-vector-icons/Feather';
import Name from 'react-native-vector-icons/AntDesign';
import {connect, useSelector} from 'react-redux';
import {useAuth} from '../../services/authContext';
const {width} = Dimensions.get('window');
import ChangeNameModal from './ChangeNameModal';
import ChangeEmailModal from './ChangeEmailModal';
import ChangePassModal from './ChangePassModal';
const Acount = () => {
  const [visibilityNameModal, setVisibilityNameModal] = useState(false);
  const [visibilityEmailModal, setVisibilityEmailModal] = useState(false);
  const [visibilityPassModal, setVisibilityPassModal] = useState(false);

  const {singOut} = useAuth();
  const email = useSelector((state) => state.customer.email);
  const name = useSelector((state) => state.customer.name);
  const isThereAnActiveOrder = useSelector((state) => state.cart.orderId);
  const handleLogout = async () => {
    await AsyncStorage.clear();
    singOut();
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1, top: 60}}>
        <View style={styles.viewConfs}>
          <View>
            <Name name="profile" size={30} color="#6200ee" />
          </View>
          <View>
            <Text>{name}</Text>
          </View>
          <TouchableOpacity onPress={() => setVisibilityNameModal(true)}>
            <Edit name="edit" size={30} color="#6200ee" />
          </TouchableOpacity>
          <ChangeNameModal
            setVisibilityNameModal={setVisibilityNameModal}
            visibilityNameModal={visibilityNameModal}
          />
        </View>
        <View style={styles.viewConfs}>
          <View>
            <MailIcon name="email" size={30} color="#6200ee" />
          </View>
          <View>
            <Text>{email}</Text>
          </View>
          <TouchableOpacity onPress={() => setVisibilityEmailModal(true)}>
            <Edit name="edit" size={30} color="#6200ee" />
          </TouchableOpacity>
          <ChangeEmailModal
            visibilityEmailModal={visibilityEmailModal}
            setVisibilityEmailModal={setVisibilityEmailModal}
          />
        </View>
        <View style={styles.viewConfs}>
          <View>
            <Pass name="key" size={30} color="#6200ee" />
          </View>
          <View>
            <Text>*************</Text>
          </View>
          <TouchableOpacity onPress={() => setVisibilityPassModal(true)}>
            <Edit name="edit" size={30} color="#6200ee" />
          </TouchableOpacity>
          <ChangePassModal
            visibilityPassModal={visibilityPassModal}
            setVisibilityPassModal={setVisibilityPassModal}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            height: 80,
            justifyContent: 'center',
            margin: 15,
          }}>
          {isThereAnActiveOrder ? (
            <TouchableOpacity
              style={styles.logoutButton}
              //disabled={!isValid || isSubmitting}
            >
              <Text style={{color: 'white'}}>
                {' '}
                Você não pode deslogar com uma comanda ativa!{' '}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => handleLogout()}
              //disabled={!isValid || isSubmitting}
            >
              <Text style={{color: 'white'}}>Logout</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  logoutButton: {
    width: width / 1.5,
    marginTop: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#6200ee',
    borderRadius: 5,
    borderColor: 'white',
    margin: 15,
  },
  viewConfs: {
    flexDirection: 'row',
    height: 80,
    justifyContent: 'space-between',
    margin: 15,
  },
});
export default connect(null, null)(Acount);
