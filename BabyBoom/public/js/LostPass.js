import React, {Component} from 'react';
import GenerateForm from 'react-native-form-builder';
import {Text, View, ScrollView, Image} from 'react-native';
import Button from 'apsl-react-native-button';
import axios from 'axios';

const email = [
  {
    type: 'email',
    name: 'email',
    required: true,
    icon: 'ios-person',
    label: 'email',
  },
];
const styles = {
    container: {
        flex: 1,
        width: '100%',
        //backgroundColor:'rgba(255, 91, 170, 0.1)'
    },
    wrap_content: {
      marginBottom:0,
      marginTop:100,
    },
    button: {
        borderColor: "transparent",
        borderRadius: 20,
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        width:'50%',
        alignSelf:'center'
    },
    send: {
        fontSize:15,
        fontFamily: 'Verdana',
        color: "white"
    },
    text: {
      fontSize:15,
      fontFamily: 'Verdana',
      alignSelf:'center',
      textDecorationLine:'underline'
    }
};

export default class LostPwd extends React.Component {
      handleSubmit = () => {
        const value = this._form.getValue();
      }
      lostPwd() {
        const formValues = this.formGenerator.getValues();

        const { navigate } = this.props.navigation;

        axios.post('http://' + global.ip + '/forgetPassword', {
        withCredentials: true,
        email: formValues.email,
      })
      .then(function (response) {
        if(response.data.error == true) {
      }
      else if(response.data.error == false) {
          navigate('Login')
      }
      })
      .catch(function (error) {
      console.log(error);
      });
      }
      render() {
        const { navigate } = this.props.navigation;
      return (
          <ScrollView style={styles.container}>
              <View style={styles.wrap_content}>
                <Image style={{width:200, height:200, borderRadius:100, alignSelf:'center', borderColor:'black', borderWidth:1}}
                  source={require('../images/BabyBoom.png')}/>
                  <GenerateForm
                      ref={(c) => {
                        this.formGenerator = c;
                      }}
                        fields= {email}/>
              </View>
              <View >
                  <Button
                      title="send"
                      style={styles.button}
                      block onPress={() => this.lostPwd()}>
                      <Text style={styles.send}>Send</Text>
                  </Button>
                  <Text style={styles.text} onPress={() => navigate('Login')}>Back</Text>
              </View>
          </ScrollView>
      );
    }
}
