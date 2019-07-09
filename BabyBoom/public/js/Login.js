import React, {Component} from 'react';
import GenerateForm from 'react-native-form-builder';
import { Text, View, Image,ScrollView} from 'react-native';
import Button from 'apsl-react-native-button';
import axios from 'axios';

const login = [
    {
      type: 'email',
      name: 'email',
      required: true,
      icon: 'ios-person',
      label: 'email',
      color: 'black'
    },
    {
      type: 'password',
      name: 'password',
      icon: 'ios-lock',
      required: true,
      label: 'Password',
      color: 'black'
    },
];

const styles = {
  container: {
      flex: 1,
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
      marginTop:30,
      alignSelf:'center'
  },
  login: {
      fontSize:15,
      fontFamily: 'Verdana',
      color: "white",
      alignSelf:'center'
  },
  text: {
    fontSize:15,
    fontFamily: 'Verdana',
    alignSelf:'center',
    textDecorationLine:'underline'
  }
};

export default class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

        };
    }
    handleSubmit = () => {
      const value = this._form.getValue();
    }

    login() {
      const formValues = this.formGenerator.getValues();
      const { navigate } = this.props.navigation;

      axios.post('http://' + global.ip + '/login', {
      withCredentials: true,
      email: formValues.email,
      password: formValues.password,
    })
    .then(function (response) {
        if(response.data.error == false) {
            global.accessToken = response.data.access_token
            if (response.data.role == 1 || response.data.role == 0) {
                global.user_id = response.data.id;
                navigate('Admin');
            } else if (response.data.role == 2) {
                global.user_id = response.data.id;
                navigate('MyBabies');
            }
        } else {
            
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
                <ScrollView style={styles.container}>
                    <View style={styles.wrap_content}>
                        <Image style={{width:200, height:200, borderRadius:100, alignSelf:'center', borderColor:'black', borderWidth:1, marginTop:70}}
                            source={require('../images/BabyBoom.png')}/>
                        <GenerateForm
                          ref={(c) => {
                            this.formGenerator = c;
                          }}
                          fields= {login}/>
                    </View>
                    <View>
                      <Button title="login" style={styles.button}block onPress={() => this.login()}>
                          <Text style={styles.login} >Login</Text>
                      </Button>
                      <Text style={styles.text} onPress={() => navigate('LostPwd')}>Forgotten password?</Text>
                    </View>
                </ScrollView>
          </View>
      );
    }
}
