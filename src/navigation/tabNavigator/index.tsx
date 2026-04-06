import { observer } from 'mobx-react-lite';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useUiContext } from '../../UIProvider';
import { useIsUserAuthorized } from '@/hooks/useIsUserAuthorized';
import { TabBarIcon } from './components/TabBarIcon';
import { HomeIcon } from '@assets/icons/HomeIcon';
import { LocationIcon } from '@assets/icons/LocationIcon';
import { CameraIcon } from '@assets/icons/CameraIcon';
import { FeedIcon } from '@assets/icons/FeedIcon';
import { PersonIcon } from '@assets/icons/PersonIcon';
import { ScannerStack } from '../scannerStackNavigator';
import { HomeStack } from '../homeStackNavigator';
import { ProfileStack } from '../profileStackNavigator';
import { EventStack } from '../eventStackNavigator';
import { FeedStack } from '../feedStackNavigator';
import { CustomTabBar } from './components/CustomTabBar';

const Tab = createBottomTabNavigator();

export const TabNavigator = observer(() => {
    const { colors, t } = useUiContext();
    useIsUserAuthorized();

    return (
        <Tab.Navigator
            initialRouteName="HomeStack"
            screenOptions={{
                headerShown: false,
            }}
            tabBar={props => <CustomTabBar {...props} />}
            detachInactiveScreens={false}
        >
            <Tab.Screen
                name="HomeStack"
                component={HomeStack}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: t('tabNavigator.homeTabLabel'),
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={HomeIcon} />,
                }}
            />
            <Tab.Screen
                name="EventStack"
                component={EventStack}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: t('tabNavigator.eventMap'),
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={LocationIcon} />,
                    tabBarAccessibilityLabel: 'disabled',
                }}
            />
            <Tab.Screen
                name="ScannerStack"
                component={ScannerStack}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: t('tabNavigator.scanner'),
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={CameraIcon} />,
                }}
            />
            <Tab.Screen
                name="FeedStack"
                component={FeedStack}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: t('tabNavigator.feed'),
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={FeedIcon} />,
                    tabBarAccessibilityLabel: 'disabled',
                }}
            />
            <Tab.Screen
                name="ProfileStack"
                component={ProfileStack}
                options={{
                    tabBarActiveTintColor: colors.primary,
                    tabBarInactiveTintColor: colors.text_light,
                    tabBarLabel: t('tabNavigator.youTabLabel'),
                    tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} Icon={PersonIcon} />,
                }}
            />
        </Tab.Navigator>
    );
});
