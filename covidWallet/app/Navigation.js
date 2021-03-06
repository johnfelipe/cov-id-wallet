import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './components/TabNavigator';
import { AuthContext } from './helpers/AuthContext';
import { getisFirstTime, isFirstTime } from './helpers/Storage';
import SplashScreen from 'react-native-splash-screen';
import PassCodeContainer from './containers/PassCodeContainer';
import AuthenticationContainer from './containers/AuthenticationContainer'
import WelcomeScreen from './screens/WelcomeScreen';
import SecureIdContainer from './containers/SecureIdContainer';
import SecurityScreen from './screens/SecurityScreen';
import NotifyMeScreen from './screens/NotifyMeScreen';
import AsyncStorage from '@react-native-community/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SettingsScreen from './screens/SettingsScreen';
import QRScreen from './screens/QRScreen';
import { BLACK_COLOR, PRIMARY_COLOR, SECONDARY_COLOR } from './theme/Colors';

const Stack = createStackNavigator();


function NavigationComponent() {
  const [isFirstTime, getisFirstTime] = React.useState("true")
  const storeData = async () => {
    try {
      await AsyncStorage.setItem(
        'isfirstTime',
        'false'
      );
    } catch (error) {
      // Error saving data
    }
  };
  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
      switch (action.type) {
        case 'FIRST_TIME':
          return {
            ...prevState,

            isFirstTime: "true",
          };

      }
    },
    {
      isFirstTime: true,

    }
  );


  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('isfirstTime').then((value) => {
        console.log("Local Storage Values is " + value)
        // if (value == null) {
        //   getisFirstTime("true")
        // }
        // else {
        getisFirstTime(value)
        // }

        console.log("Value isa " + isFirstTime)
      })


    } catch (error) {
      // Error retrieving data
    }
  };

  React.useEffect(() => {
    SplashScreen.hide();
    // if ((isFirstTime == null) || (isFirstTime == true) || (isFirstTime == undefined))
    retrieveData();
  }, [isFirstTime])

  const authContext = React.useMemo(() => ({
    //isFirstTimeFunction: () => dispatch({ type: 'FIRST_TIME' })
    isFirstTimeFunction: () => {
      storeData()
      getisFirstTime("false")
      // console.log("From IsFirstTime is " + isFirstTime)
    }
  }), [])
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>

        <Stack.Navigator>
          {(isFirstTime == null) || (isFirstTime == true) ? (
            <>
              <Stack.Screen options={{ headerShown: false }} name="WelcomeScreen" component={WelcomeScreen} />
              <Stack.Screen options={{ headerShown: false }} name="PassCodeContainer" component={PassCodeContainer} />
              <Stack.Screen options={{ headerShown: false }} name="SecurityScreen" component={SecurityScreen} />
              <Stack.Screen options={{ headerShown: false }} name="SecureidContainer" component={SecureIdContainer} />
              <Stack.Screen options={{ headerShown: false }} name="NotifyMeScreen" component={NotifyMeScreen} />
            </>
          ) : (
              <>
                <Stack.Screen options={{ headerShown: false }} name="AuthenticationContainer" component={AuthenticationContainer} />
                <Stack.Screen name="MainScreen"
                  options={({ navigation }) => ({
                    headerStyle: {
                      elevation: 0,
                      shadowOpacity: 0,
                      borderBottomWidth: 0,
                    }, title: false, headerRight: () => (
                      <MaterialCommunityIcons onPress={() => { navigation.navigate('QRScreen') }} style={styles.headerRightIcon} size={30} name="qrcode" padding={30} />
                    ), headerLeft: () => (
                      <MaterialCommunityIcons onPress={() => { navigation.navigate('SettingsScreen') }} style={styles.headerRightIcon} size={30} name="settings" padding={30} />
                    )
                  })}
                  component={TabNavigator} />
                <Stack.Screen options={{ headerShown: false }} name="SettingsScreen" component={SettingsScreen} />
                <Stack.Screen options={{ headerShown: false }} name="QRScreen" component={QRScreen} />
              </>
            )
          }
        </Stack.Navigator>

      </NavigationContainer>
    </AuthContext.Provider>
  );
}

const styles = StyleSheet.create({
  headerRightIcon: {
    padding: 10,
    color: BLACK_COLOR
  }
});

export default NavigationComponent;
export { AuthContext };
