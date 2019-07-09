import React, {Component} from 'react';
import GenerateForm from 'react-native-form-builder';
import { Text, View} from 'react-native';
import Button from 'apsl-react-native-button';
import axios from 'axios';

const info = [
    {
        type: 'text',
        name: 'identifier',
        required: true,
        label: 'Identifier',
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
    {
        type: 'number',
        name: 'weight',
        required: true,
        label: 'Weight',
    },
    {
        type: 'number',
        name: 'height',
        required: true,
        label: 'Height',
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
    add: {
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

export default class AdBaby extends Component {
    handleSubmit = () => {
        const value = this._form.getValue();
        console.log('value: ', value);
    }

    addBaby() {
        const formValues = this.formGenerator.getValues();
        const { navigate } = this.props.navigation;

        axios.post('http://' + global.ip + '/addbaby', {
            withCredentials: true,
            identifier: formValues.identifier,
            firstname: formValues.firstname,
            lastname: formValues.lastname,
            weight: formValues.weight,
            height: formValues.height,
        })
        .then(function (response) {
            if(response.data.error == true) {
                
            }
            else if(response.data.error == false) {
                navigate('Admin');
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
                        fields= {info}/>
            </View>
                <View>
                    <Button
                        title="Admin"
                        style={styles.button}block onPress={() => this.addBaby()}>
                        <Text style={styles.add} >Add</Text>
                    </Button>
                    <Text style={styles.text} onPress={() => navigate('Admin')}>Back</Text>
                </View>
            </View>
        );
    }
}