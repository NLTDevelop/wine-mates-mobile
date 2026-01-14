import { observer } from 'mobx-react-lite';
import { useCallback, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { LoggerIcon } from '@/UIKit/Logger/ui/LoggerIcon';
import { ModalLogger } from '@/UIKit/Logger/ui/ModalLogger';
import { loggerModel } from '@/UIKit/Logger/entity/loggerModel';
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
