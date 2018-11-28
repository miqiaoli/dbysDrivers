import React from 'react'
import {createStackNavigator} from 'react-navigation'
import WelcomePage from '../pages/WelcomePage'
import HomePage from '../pages/HomePage'
import ListDetails from '../pages/ListDetails'
import Login from '../pages/user/Login'
import Registered from '../pages/user/Registered'
import ForgetPassword from '../pages/user/ForgetPassword'
import RegisteredAgreement from '../pages/user/RegisteredAgreement'
import Delivery from '../pages/Delivery'
import ConfirmReceipt from '../pages/ConfirmReceipt'
import Delivering from '../pages/Delivering'
import LocationPage from '../pages/LocationPage'

export const AppStackNavigator = createStackNavigator({
    WelcomePage: {
        screen: WelcomePage,
    },
    LocationPage: {
        screen: LocationPage,
    },
    HomePage: {
        screen: HomePage,
    },
    Login: {
        screen: Login,
        navigationOptions: {
            title: "登录"
        }
    },
    ForgetPassword: {
        screen: ForgetPassword,
        navigationOptions: {
            title: "忘记密码"
        }
    },
    Registered: {
        screen: Registered,
        navigationOptions: {
            title: "注册"
        }
    },
    RegisteredAgreement: {
        screen: RegisteredAgreement,
        navigationOptions: {
            title: "商城用户注册协议"
        }
    },
    ListDetails: {
        screen: ListDetails,
        navigationOptions: {
            title: "详情页"
        }
    },
    Delivery: {
        screen: Delivery,
        navigationOptions: {
            title: "待发货"
        }
    },
    ConfirmReceipt: {
        screen: ConfirmReceipt,
        navigationOptions: {
            title: "待卸货"
        }
    },
    Delivering: {
        screen: Delivering,
        navigationOptions: {
            title: "运输途中异常上报"
        }
    }
})
