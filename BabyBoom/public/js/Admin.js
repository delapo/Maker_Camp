import React, {Component} from 'react';
import { Text, View, FlatList, ScrollView, TouchableHighlight} from 'react-native';
import Button from 'apsl-react-native-button';
import axios from 'axios';

global.ip ='35.180.120.219:3000';
global.bb_id = null;

const style = {
    add: {
        fontSize:15,
        fontFamily: 'Verdana',
        color: "black"
    },
    Addbutton: {
        borderColor: "transparent",
        borderRadius: 50,
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        borderColor:'black',
        borderWidth: 1,
        width:'15%',
        height:'45%',
        alignSelf:'center'
    },
    button: {
        borderColor: "transparent",
        borderRadius: 5,
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        width:'50%',
        marginTop:15,
        alignSelf:'center'
    },
    container: {
        flex: 1,
        justifyContent:'center',
        flexDirection: 'column',
    },
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};
export default class Admin extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: [],
        };
    }

    componentDidMount() {
        axios.get('http://' + global.ip + '/getbabies', {
         withCredentials: true,
        })
        .then(response => {
            this.setState({
                data: response.data.babies,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    renderItem = ({item}) => {
        const { navigate } = this.props.navigation;
        const { didBlurSubscription } = this.props.navigation.addListener('willFocus', payload =>  {
            axios.get('http://' + global.ip + '/getbabies', {
             withCredentials: true,
            })
            .then(response => {
                    this.setState({
                    data: response.data.babies,
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        });
        return (
            <View style={{backgroundColor:'rgba(0, 0, 0, 0.02)'}}>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, }}/>
            <TouchableHighlight  onPress={() => this.setbabyiD(item.id)}>
                    <View style={{height:100}}>
                        <Text style={{fontSize:20, marginLeft:10, fontFamily: 'Verdana', marginBottom:20}}>ID : {item.identifier}</Text>
                        <View style={{height:100}}>
                            <View style={{ flex:1, flexDirection: 'row'}}>
                                <Text style={{marginLeft:30, marginBottom:5, fontSize:25, textDecorationLine:'underline'}}>Name</Text>
                                <Text style={{marginRight:30, marginBottom:5, fontSize:25, marginLeft: 'auto', textDecorationLine:'underline'}}>Lastname</Text>
                            </View>
                            <View style={{ flex:1, flexDirection: 'row', marginBottom:30}}>
                                <Text style={{marginLeft:40, fontSize:20}}>{item.firstname}</Text>
                                <Text style={{marginRight:50, fontSize:20, marginLeft: 'auto'}}>{item.lastname}</Text>
                            </View>
                        </View>
                    </View>
                </TouchableHighlight>
                    <Button
                        title="add_parent"
                        style={style.button}block onPress={() => this.setbabyIDforParent(item.id)}>
                        <Text style={{color:'white'}}>Add Parent</Text>
                    </Button>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1}}/>
            </View>
        )
    }

    setbabyiD(id) {
        const { navigate } = this.props.navigation;
        global.bb_id = id;
        navigate('BabyInfo');
    }
    setbabyIDforParent(id) {
        const { navigate } = this.props.navigation;
        global.bb_id = id;
        navigate('ParentRegister');
    }

  render() {
    const { navigate } = this.props.navigation;
    return (
        <View style={style.container}>
            <ScrollView>
                <View style={{flex:2, backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
                <Text style={{color:'black', fontSize:30, alignSelf:'center'}}>Add a Baby ?</Text>
                    <Button title="add_baby" style={style.Addbutton} block onPress={() => navigate('AdBaby')}>
                    <Text style={{color:'white', fontSize:50}}>+</Text>
                    </Button>
                </View>
                <View>
                <FlatList
                   data={this.state.data}
                   renderItem={this.renderItem}
                   keyExtractor={(item, index) => index}
               />
                </View>
            </ScrollView>
      </View>
    );
  }
}
