import {StackActions, NavigationActions} from 'react-navigation';

export default class NavigatorUtils {
    /**
     * 跳转首页
     */
    static resetToHomepage(params) {
        const {navigation} = params;
        const {token} = params;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "HomePage",
                    params: { token: token }
                })
            ]
        });
        navigation.dispatch(resetAction);
    }
    /**
     * 跳转登录页面
     */
    static resetToLogin(params) {
        const {navigation} = params;
        const resetAction = StackActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    routeName: "Login"
                })
            ]
        });
        navigation.dispatch(resetAction);
    }

}
