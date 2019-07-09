/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import { AppDrawerNavigator } from "./public/Menu";

 export default class App extends React.Component {
     render() {
         return (
             <AppDrawerNavigator />
         );
     }
 }