import React from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';


const Confirm = ({children, visible, onAccept, onDecline}) => {

  const {textStyle, containerStyle, viewStyle, buttonStyle, textButtonStyle} = styles;

  return (

      <Modal
          visible={visible}
          transparent
          animationType="slide"
          onRequestClose={() => {}}
      >
        <View style={containerStyle}>
          <View style={viewStyle}>
            <Text style={textStyle}>{children}</Text>
          </View>

          <View style={viewStyle}>
            <TouchableOpacity onPress={onAccept} style={ buttonStyle }>
              <Text style={ textButtonStyle }>Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecline} style={ buttonStyle }>
              <Text style={ textButtonStyle }>No
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );
};

Confirm.propTypes = {
  onDecline: PropTypes.func,
  onAccept: PropTypes.func,
  visible: PropTypes.bool,
  children:PropTypes.string,
};


const styles = {
  textStyle: {
    flex: 1,
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 40,
  },
  containerStyle: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',

  },
  viewStyle:{
    borderBottomWidth:1,
    padding:10,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    flexDirection:'row',
    borderColor:'#ddd',
    position: 'relative',
  },
  buttonStyle:{
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#3faab4',
    marginRight: 5,
    marginLeft: 5,
  },
  textButtonStyle: {
    alignSelf: 'center',
    color: '#3faab4',
    fontSize:16,
    fontWeight:'600',
    paddingTop:10,
    paddingBottom:10,
  },
};

export { Confirm };
