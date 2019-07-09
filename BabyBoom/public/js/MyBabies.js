import React, {Component} from 'react';
import { Text, View, FlatList, ScrollView, TouchableHighlight, Image} from 'react-native';
import Button from 'apsl-react-native-button';
import randomcolor from 'randomcolor';
import axios from 'axios';

global.user_id = 11;
const style = {
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    add: {
        fontSize:20,
        marginLeft:10,
        fontFamily: 'Verdana',
    },
    view: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
};
export default class MyBabies extends Component {

    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            data: [],
        };
    }

    componentDidMount() {
        axios.post('http://' + global.ip + '/getbabybyparent', {
         withCredentials: true,
         id: global.user_id,
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
            axios.post('http://' + global.ip + '/getbabybyparent', {
                withCredentials: true,
                id: global.user_id,
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
            <View style={{backgroundColor:'rgba(0, 0, 0, 0.05)'}}>
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
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop:20}}/>
            </View>
        )
    }
    setbabyiD(id) {
        const { navigate } = this.props.navigation;
        global.bb_id = id;
        navigate('BabyInfo');
    }

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={style.container}>
                <View>
                <Image style={{width:180, height:180, borderRadius:100, alignSelf:'center', borderColor:'black', borderWidth:1, marginTop:70}} source={require('../images/BabyBoom.png')}/>
                    <Text style={{color:"rgba(0, 0, 0, 0.8)", fontSize: 50, alignSelf:'center', height: 100}}>My Babies</Text>
                </View>
            <View style={{ borderBottomColor: 'black', borderBottomWidth: 1,}}/>
                <ScrollView>
                    <View style={{flex:2}}>
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
