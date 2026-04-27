import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { getStyles } from './styles';

interface IRoute {
    key: string;
    title: string;
}

interface IProps {
    tabBarProps: {
        navigationState: {
            index: number;
            routes: IRoute[];
        };
    };
    onIndexChange: (index: number) => void;
}

export const TabsBar = ({ tabBarProps, onIndexChange }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { navigationState } = tabBarProps;

    return (
        <View style={styles.tabBarContainer}>
            {navigationState.routes.map((route: IRoute, index: number) => {
                const isFocused = navigationState.index === index;
                const onPress = () => {
                    onIndexChange(index);
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        style={[styles.tabItem, isFocused ? styles.activeTabItem : undefined]}
                        onPress={onPress}
                    >
                        <Typography variant={'body_500'} text={route.title} style={styles.tabLabel} />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};
