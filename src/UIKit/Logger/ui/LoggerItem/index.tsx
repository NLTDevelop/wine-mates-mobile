import { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { ILog } from '../../entity/loggerModel';
import { getStyles } from './styles';

interface IProps {
    item: ILog;
}

export const LoggerItem = ({ item }: IProps) => {
    const [show, setShow] = useState(false);
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const onShow = useCallback(() => {
        setShow(prev => !prev);
    }, []);

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
