import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { CustomAlert } from '@/UIKit/CustomAlert/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { IWinePurchasePartner } from '@/entities/wine/types/IWinePurchasePartner';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    partner: IWinePurchasePartner | null;
    onClose: () => void;
    onOpenWebsite: () => void;
}

export const WinePartnerModal = ({ visible, partner, onClose, onOpenWebsite }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <CustomAlert
            visible={visible}
            onClose={onClose}
            header={partner?.name || ''}
            content={
                <Typography
                    text={partner?.description || ''}
                    variant="body_400"
                    style={styles.description}
                />
            }
            footer={
                <View style={styles.buttons}>
                    <Button text={t('wineMarketplace.visitWebsite')} onPress={onOpenWebsite} />
                    <Button text={t('common.close')} onPress={onClose} type="secondary" />
                </View>
            }
        />
    );
};
