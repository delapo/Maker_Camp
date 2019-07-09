import React, {Component} from 'react';
import { View, Text, Button, SafeAreaView, ScrollView, Dimensions, Image, StyleSheet } from 'react-native';
import { createAppContainer, createStackNavigator, createDrawerNavigator, DrawerItems, StackActions, NavigationActions, StackNavigator } from 'react-navigation'; // Version can be specified in package.json

// Pages
import Admin from "./js/Admin";
import BabyInfo from "./js/BabyInfo";
import Login from "./js/Login";
import MyBabies from "./js/MyBabies";
import ParentRegister from "./js/ParentRegister";
import LostPwd from "./js/LostPass";
import AdBaby from "./js/AdBaby"

//Functions
const CustomDrawerComponent = (props) => (
    <SafeAreaView style={{ flex: 1 ,backgroundColor:'rgba(0, 0, 0, 0)', color:'white', width: 0}} >
        <ScrollView>
            <DrawerItems {...props} />
        </ScrollView>
    </SafeAreaView>
)

const DrawerNavigator = createDrawerNavigator({
    Login: {
        screen: Login,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
    LostPwd: {
        screen: LostPwd,
        navigationOptions: {
            drawerLabel: () => null
        }
    },
    Admin: Admin,
    BabyInfo: BabyInfo,
    MyBabies: MyBabies,
    ParentRegister: ParentRegister,
    AdBaby: AdBaby
}, {
    contentComponent: CustomDrawerComponent,
    contentOptions: {
        activeTintColor: 'black',
        labelStyle: {
            color: 'rgba(200, 200, 200, 1)',
        },
    }

})

export const AppDrawerNavigator = createAppContainer(DrawerNavigator);
