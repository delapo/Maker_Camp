import React, {Component} from 'react';
import { Text, View, ScrollView, Image, TouchableHighlight} from 'react-native';
import Button from 'apsl-react-native-button';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import axios from 'axios';

const style = {
    container: {
        flex: 1,
        justifyContent:'center',
        flexDirection: 'column',
    },
    view: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    titre: {
        fontSize: 20,
        color: 'rgba(0, 0, 0, 0.8)'
    },
    text: {
        fontSize:15,
        fontFamily: 'Verdana',
        alignSelf:'center',
        textDecorationLine:'underline'
    },
    textInfo2: {
        fontSize: 16,
        marginLeft:30,
        color: 'black',
    },
    textInfo: {
        fontSize: 16,
        marginTop:20,
        marginBottom:5,
        marginLeft:20,
        color: 'black',
    },
    button: {
        borderColor: "transparent",
        borderRadius: 20,
        backgroundColor:'rgba(0, 0, 0, 0.8)',
        width:'50%',
        alignSelf:'center',
        margin: 15
    },
    del: {
        fontSize:15,
        fontFamily: 'Verdana',
        color: "white"
    },
    map: {
        height: 400,
        width: 400,
        justifyContent: 'flex-end',
        alignItems: 'center',
        }

};

export default class BabyInfo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            loading: true,
            data: [],
            role: null,
            region: {
                latitude: 0,
                longitude: 0,
                latitudeDelta: 0.015,
                longitudeDelta: 0.0121,
            },
            coordinate: {
                latitude: 0,
                longitude: 0,
            },
            map: 0,
        };
    }

    async componentDidMount() {
        await axios.get('http://' + global.ip + '/getbabybyid/' + global.bb_id, {
        withCredentials: true,
        })
        .then(response => {
            this.setState({
                data: response.data.baby,
                region: {
                    latitude: response.data.baby.longitude,
                    longitude: response.data.baby.latitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                },
                coordinate: {
                    latitude: response.data.baby.longitude,
                    longitude: response.data.baby.latitude,
                },
                map: 1,
            });
        })
        .catch(function (error) {
            console.log(error);
        });
        axios.post('http://' + global.ip + '/getrole/', {
            withCredentials: true,
            id: global.user_id
        }).then(response => {
            this.setState({
                role: response.data.role.role,
            });
        })
    }

    deletebaby() {
        const {navigate} = this.props.navigation;
        axios.delete('http://' + global.ip + '/deletebaby/' + global.bb_id);
        navigate("Admin");
    }
  render() {
    const {navigate} = this.props.navigation;
    return (
        <View>
            {this.state.role == 2 ?
                <TouchableHighlight onPress={() => navigate('MyBabies')} style={{height:120, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                    <Image
                        style={{width:70, height:70, borderRadius:100, alignSelf:'center', borderColor:'black', borderWidth:1, marginTop:20, backgroundColor:'white'}}
                        source={require('../images/home.png')}/>
                </TouchableHighlight> :
                <TouchableHighlight onPress={() => navigate('Admin')} style={{height:120, backgroundColor:'rgba(0, 0, 0, 0.5)'}}>
                    <Image
                        style={{width:70, height:70, borderRadius:100, alignSelf:'center', borderColor:'black', borderWidth:1, marginTop:20, backgroundColor:'white'}}
                        source={require('../images/home.png')}/>
                </TouchableHighlight> }
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1}}/>
            <ScrollView style={{width:'100%'}}>
              <Text style={style.textInfo}>Baby ID : {this.state.data.identifier}</Text>
              <View style={{ flex:1, flexDirection: 'row', width:'100%'}}>
                   <Text style={style.textInfo2}>{this.state.data.firstname}</Text>
                   <Text style={style.textInfo2}>{this.state.data.lastname}</Text>
              </View>
              <View style={{ borderBottomColor: 'black', borderBottomWidth: 1, marginTop:20}}/>
              <View style={{ flex:1, flexDirection: 'row', marginTop:10, backgroundColor:'white', padding:20}}>
                   <Text style={style.textInfo}>Weight : {this.state.data.weight}</Text>
               </View>
               <View style={{ borderBottomColor: 'black', borderBottomWidth: 1,}}/>
               <View style={{ flex:1, flexDirection: 'row', backgroundColor:'white', padding:20}}>
                  <Text style={style.textInfo}>Height : {this.state.data.height}</Text>
              </View>
              <View style={{ borderBottomColor: 'black', borderBottomWidth: 1,}}/>
               <View style={{ flex:1, flexDirection: 'row', backgroundColor:'white', padding:20}}>
                  <Text style={style.textInfo}>Temperature : {this.state.data.temperature}</Text>
              </View>
              <View style={{ borderBottomColor: 'black', borderBottomWidth: 1,}}/>
               <View style={{ flex:1, flexDirection: 'row', backgroundColor:'white', padding:20}}>
                  <Text style={style.textInfo}>Heartbeat : {this.state.data.heartbeat}</Text>
              </View>
              {(this.state.map == 1) ? <MapView
                style={style.map}
                initialRegion={this.state.region}>
                  <Marker
                    coordinate={this.state.coordinate}
                    title="Your Baby"
                    description="The current position of your baby"
                  />
              </MapView> : null }
                {this.state.role != 2 ?
              <Button style={style.button} onPress={()=> this.deletebaby()}>
                  <Text style={{color: "white"}}>Delete</Text>
              </Button> : null}
            </ScrollView>
            </View>
    )
  }
}

//export default Home
