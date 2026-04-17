import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    onClose: () => void;
}

export const EventFiltersModal = ({ visible, onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={visible} onClose={onClose}>
            <View style={styles.container}>
                <Typography text={t('common.filters')} variant="h3" style={styles.title} />

                <View style={styles.content}>
                    <Typography
                        text="Will be available later"
                        variant="body_400"
                        style={styles.placeholder}
                    />
                </View>

                <View style={styles.footer}>
                    <Button
                        text={t('common.clear')}
                        onPress={onClose}
                        type="secondary"
                        containerStyle={styles.button}
                    />
                    <Button
                        text={t('common.showResults')}
                        onPress={onClose}
                        type="main"
                        containerStyle={styles.button}
                    />
                </View>
            </View>
        </BottomModal>
    );
};
