import { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Typography } from '@/UIKit/Typography';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

export const CustomTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
    const { colors } = useUiContext();
    const { bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom), [colors, bottom]);

    return (
        <View style={styles.container}>
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const activeColor = options.tabBarActiveTintColor ?? colors.primary;
                const inactiveColor = options.tabBarInactiveTintColor ?? colors.text_light;
                const color = isFocused ? activeColor : inactiveColor;

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name, route.params);
                    }
                };

                const icon = options.tabBarIcon
                    ? options.tabBarIcon({ focused: isFocused, color, size: 24 })
                    : null;

                const label = typeof options.tabBarLabel === 'string'
                    ? options.tabBarLabel
                    : route.name;

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={styles.tabItem}
                        onPress={onPress}
                    >
                        {icon}
                        <Typography
                            variant="subtitle_12_400"
                            text={String(label)}
                            style={[styles.text, { color }]}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
