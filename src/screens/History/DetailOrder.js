import React from 'react';
import {
  Text,
  View,
  Dimensions,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
const {width, height} = Dimensions.get('window');
import AntiIcon from 'react-native-vector-icons/AntDesign';
import MaterialComunity from 'react-native-vector-icons/MaterialCommunityIcons';
import 'moment/locale/pt-br';
import {FlatList} from 'react-native-gesture-handler';

const DetailOrder = ({visibilityModal, setVisibility, data}) => {
  const renderOrderedItems = (item, index) => {
    let message;
    let icon;
    switch (item.confirmed) {
      case 1:
        message = 'Confirmado!';
        icon = 'checkcircle';
        break;
      case 2:
        message = 'Negado';
        icon = 'exclamationcircle';
        break;
      case 3:
        message = 'Em preparo';
        icon = 'clockcircle';
        break;
      case 0:
        message = 'Não atendido';
        icon = 'clockcircle';
        break;

      default:
        break;
    }
    return (
      <View style={styles.cardItemContainer}>
        <View style={styles.cardItemHeader}>
          <Text style={{fontSize: 20, color: 'black'}}>{item.name}</Text>
        </View>
        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <AntiIcon name={icon} size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Status:</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fontStyle}>{message}</Text>
          </View>
        </View>
        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <AntiIcon name="shoppingcart" size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Quantidade:</Text>
            </View>
          </View>

          <View>
            <Text style={styles.fontStyle}>{item.quantity}</Text>
          </View>
        </View>
        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <MaterialComunity name="dice-1" size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Unidade:</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fontStyle}>
              R$ {parseFloat(item.value).toFixed(2)}
            </Text>
          </View>
        </View>
        <View style={styles.cardItemSection}>
          <View style={styles.cardItemIcon}>
            <View>
              <MaterialComunity name="dice-multiple" size={30} />
            </View>
            <View>
              <Text style={styles.fontStyle}>Total:</Text>
            </View>
          </View>
          <View>
            <Text style={styles.fontStyle}>
              R$ {parseFloat(item.value * item.quantity).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  const {orders} = data;
  return (
    <Modal transparent={true} animationType="slide" visible={visibilityModal}>
      <View style={{flex: 1, backgroundColor: '#6200ee'}}>
        <View style={{flex: 1}}>
          <View style={{flex: 4}}>
            <FlatList
              ListEmptyComponent={
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: 50,
                  }}>
                  <ActivityIndicator size="large" color="#0000ff" />
                </View>
              }
              data={orders}
              renderItem={({item, index}) => renderOrderedItems(item, index)}
              keyExtractor={(item, index) => `list-item-${index}`}
            />
          </View>
          <View style={{flex: 1}}>
            <TouchableOpacity
              style={styles.buttonStyle}
              onPress={() => {
                setVisibility(false);
              }}>
              <Text
                adjustsFontSizeToFit={true}
                style={{
                  color: '#6200ee',
                }}>
                {'Voltar'}{' '}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  backButtonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: '#FCFCFC',
  },

  imageStyle: {
    flex: 1,
    width: undefined,
    height: undefined,
  },
  image: {
    width: width / 1.2,
    height: height / 2,
    borderBottomLeftRadius: 40,
    borderTopLeftRadius: 5,
  },
  contentContainer: {
    flex: 1,
    margin: 10,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  nameContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 30,
    fontStyle: 'italic',
    alignSelf: 'flex-start',
  },
  valueContainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 2,
  },
  cardItemContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    margin: 10,
    borderColor: '#7D7D7D',
    borderRadius: 5,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
  },
  cardItemHeader: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderTopColor: '#7D7D7D',
    borderBottomColor: '#7D7D7D',
    borderLeftColor: '#FAFAFA',
    borderRightColor: '#FAFAFA',
    borderWidth: 0.5,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cardItemIcon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  cardItemSection: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FAFAFA',
    borderTopColor: '#7D7D7D',
    borderBottomColor: '#7D7D7D',
    borderLeftColor: '#FAFAFA',
    borderRightColor: '#FAFAFA',
    borderWidth: 0.5,
    justifyContent: 'space-between',
    padding: 10,
  },
  fontStyle: {
    color: '#7D7D7D',
    fontSize: 20,
    fontWeight: '400',
  },
});
export default DetailOrder;
