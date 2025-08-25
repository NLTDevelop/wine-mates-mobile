import { observer } from 'mobx-react';
import { useCallback, useMemo } from 'react';
import { FlatList, Modal, TouchableOpacity, View, Text } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { LoggerItem } from '../LoggerItem';
import { ILog, loggerModel } from '../../entity/loggerModel';
import { getStyles } from './styles';

export const ModalLogger = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const renderItem = useCallback(({ item }: any) => <LoggerItem item={item} />, []);
    const keyExtractor = useCallback((item: ILog) => item.id, []);

    const onClose = useCallback(() => {
        loggerModel.isVisibleLogs = false;
    }, []);

    return (
        <Modal visible={loggerModel.isVisibleLogs}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity style={styles.button} onPress={onClose}>
                        <Text style={styles.buttonText}>Close</Text>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={loggerModel.logs}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    style={styles.container}
                />
            </View>
        </Modal>
    );
});
