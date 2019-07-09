import React, {Component} from 'react';
import GenerateForm from 'react-native-form-builder';
import { Text, View } from 'react-native';
import Button from 'apsl-react-native-button';
import axios from 'axios';

const register = [
    {
      type: 'email',
      name: 'email',
      required: true,
      label: 'email',
    },
    {
        type: 'text',
        name: 'firstname',
        required: true,
        label: 'Firstname',
    },
    {
        type: 'text',
        name: 'lastname',
        required: true,
        label: 'Lastname',
    },
];

const styles = {
  container: {
      flex: 1,
      justifyContent:'center',
      flexDirection: 'column',
  },
  wrap_content: {
      marginBottom:0,
      marginTop:0,
      padding: 0,
  },
  button: {
      borderColor: "transparent",
      borderRadius: 20,
      backgroundColor:'rgba(0, 0, 0, 0.8)',
      width:'50%',
      alignSelf:'center'
  },
  register: {
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

export default class ParentRegister extends React.Component {
    handleSubmit = () => {
        const value = this._form.getValue();
        console.log('value: ', value);
    }
    login() {
        const formValues = this.formGenerator.getValues();
        console.log('FORM VALUES', formValues);

        const { navigate } = this.props.navigation;

        axios.post('http://' + global.ip + '/addparenttobaby/' + global.bb_id, {
        withCredentials: true,
        email: formValues.email,
        firstname: formValues.firstname,
        lastname: formValues.lastname,
      })
      .then(function (response) {
        if(response.data.error == true) {
      }
      else if(response.data.error == false) {
          navigate('Admin')
      }
      })
      .catch(function (error) {
      console.log(error);
      });
      }
    render() {
        const { navigate } = this.props.navigation;
      return (
          <View style={styles.container}>
              <View style={styles.wrap_content}>
                  <GenerateForm
                      ref={(c) => {
                        this.formGenerator = c;
                      }}
                      fields= {register}/>
          </View>
              <View >
                  <Button
                      title="register"
                      style={styles.button}block onPress={() => this.login()}>
                      <Text style={styles.register}>Validate</Text>
                  </Button>
                  <Text style={styles.text} onPress={() => navigate('Admin')}>Back</Text>
              </View>
          </View>
      );
    }
}
