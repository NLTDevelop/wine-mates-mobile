import { observer } from 'mobx-react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUiContext } from '../../UIProvider';
import { Typography } from '../../UIKit/Typography';
// import { TabBarIcon } from './components/TabBarIcon';
import { HomeView } from '@/modules/home/ui/HomeView';
import { PersonalProfileView } from '@/modules/personalProfile/ui/PersonalProfileView';
import { useIsUserAuthorized } from '@/hooks/useIsUserAuthorized';

const Tab = createBottomTabNavigator();

export const TabNavigator = observer(() => {
    const { colors, t } = useUiContext();
    useIsUserAuthorized();

    return (
        <Tab.Navigator initialRouteName="HomeView" screenOptions={{ headerShown: false }} detachInactiveScreens={false}>
            <Tab.Screen
                name="HomeView"
                component={HomeView}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: ({ color }) => (
                        <Typography variant={'subtitle_12_400'} style={{ color }}>
                            {t('tabNavigator.homeTabLabel')}
                        </Typography>
                    ),
                    // tabBarIcon: () => <TabBarIcon source={require('../../assets/lottie/homeTab.lottie')} />,
                }}
            />
            <Tab.Screen
                name="PersonalProfileView"
                component={PersonalProfileView}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: ({ color }) => (
                        <Typography variant={'subtitle_12_400'} style={{ color }}>
                            {t('tabNavigator.youTabLabel')}
                        </Typography>
                    ),
                    // tabBarIcon: () => <TabBarIcon source={require('../../assets/lottie/homeTab.lottie')} />,
                }}
            />
        </Tab.Navigator>
    );
});
