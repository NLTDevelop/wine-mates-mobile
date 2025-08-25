import { observer } from 'mobx-react';
import { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '../../../../UIProvider';
import { LoggerIcon } from '../LoggerIcon';
import { ModalLogger } from '../ModalLogger';
import { loggerModel } from '../../entity/loggerModel';
import { getStyles } from './styles';

export const Logger = observer(() => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const onOpen = useCallback(() => {
        loggerModel.isVisibleLogs = true;
    }, []);

    return (
        <>
            <TouchableOpacity style={styles.button} onPress={onOpen}>
                <LoggerIcon color={'gray'} />
            </TouchableOpacity>
            <ModalLogger />
        </>
    );
});
