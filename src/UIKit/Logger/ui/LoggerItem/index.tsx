import { useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { useLoggerItem } from '@/UIKit/Logger/presenters/useLoggerItem';
import { ILog } from '@/UIKit/Logger/types';
import { getStyles } from './styles';

interface IProps {
    item: ILog;
}

export const LoggerItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { show, onShow } = useLoggerItem();

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onShow} style={styles.button}>
                <>
                    <Text style={styles.text}>{item.type}</Text>
                    <Text style={styles.name}>{item.name}</Text>
                </>
            </TouchableOpacity>
            {show && (
                <Text style={styles.text} selectable={true}>
                    {item.message}
                </Text>
            )}
        </View>
    );
};
