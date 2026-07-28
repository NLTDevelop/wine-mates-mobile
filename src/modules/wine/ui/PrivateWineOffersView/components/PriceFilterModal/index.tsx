import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { RangeSlider } from '@/UIKit/RangeSlider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { getStyles } from './styles';

interface IProps {
    visible: boolean;
    min: number;
    max: number;
    minValue: number;
    maxValue: number;
    onChange: (minValue: number, maxValue: number) => void;
    onClose: () => void;
    onApply: () => void;
}

export const PriceFilterModal = ({
    visible,
    min,
    max,
    minValue,
    maxValue,
    onChange,
    onClose,
    onApply,
}: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <BottomModal visible={visible} onClose={onClose} title={t('common.filters')}>
            <View style={styles.content}>
                <Typography text={t('wineMarketplace.price')} variant="body_500" />
                <RangeSlider
                    min={min}
                    max={max}
                    minValue={minValue}
                    maxValue={maxValue}
                    onChange={onChange}
                    step={10}
                    valueSuffix=" UAH"
                    activeColor={colors.primary}
                    inactiveColor={colors.background_grey}
                />
                <Button text={t('common.save')} onPress={onApply} />
            </View>
        </BottomModal>
    );
};
