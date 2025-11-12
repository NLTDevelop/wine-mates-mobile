import { Dimensions, View } from 'react-native';
import Modal from 'react-native-modal';
import { useMemo } from 'react';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '../Typography';
import { Button } from '../Button';

interface IProps {
    isVisible: boolean;
    onHide: () => void;
    onConfirm: () => void;
    title: string;
    isSending?: boolean;
    description?: string;
    buttonText?: string;
}

export const ConfirmationModal = ({ isVisible, onHide, onConfirm, description, isSending = false, title, buttonText }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <Modal
            isVisible={isVisible}
            onBackdropPress={onHide}
            onBackButtonPress={onHide}
            backdropTransitionOutTiming={400}
            animationInTiming={400}
            animationOutTiming={400}
            backdropOpacity={0.5}
            style={styles.modal}
            deviceHeight={Dimensions.get('screen').height}
            deviceWidth={Dimensions.get('screen').width}
            useNativeDriver={true}
            useNativeDriverForBackdrop={true}
            hideModalContentWhileAnimating={true}
            statusBarTranslucent
        >
            <View style={styles.modalContent}>
                <Typography style={styles.title} variant="h4" text={title} />
                {description && <Typography style={styles.text} variant="body_400" text={description} />}
                <Button text={buttonText || t('common.agreeAndContinue')} onPress={onConfirm} inProgress={isSending} />
            </View>
        </Modal>
    );
};
