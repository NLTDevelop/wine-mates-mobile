import { ReactElement, ReactNode, useMemo } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';

interface IProps {
    children: ReactNode;
    stackHeader?: ReactElement;
}

export const StackWrapper = ({ children, stackHeader }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            {stackHeader && (
                <SafeAreaView edges={['top']} style={styles.headerContainer}>
                    {stackHeader}
                </SafeAreaView>
            )}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
};
