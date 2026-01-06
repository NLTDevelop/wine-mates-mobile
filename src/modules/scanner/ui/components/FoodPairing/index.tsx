import { Dispatch, SetStateAction, useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { Button } from '@/UIKit/Button';
import { CrownIcon } from '@assets/icons/CrownIcon';
import { useFoodPairing } from '@/modules/scanner/presenters/useFoodPairing';
import { userModel } from '@/entities/users/UserModel';
import { IRateContext } from '@/entities/wine/types/IRateContext';

interface IProps {
    limits: IRateContext | null;
    setLimits: Dispatch<SetStateAction<IRateContext | null>>;
}

export const FoodPairing = ({ limits, setLimits }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { snacks, isGenerating, onGeneratePress } = useFoodPairing(limits, setLimits);
    const hasSnacks = !!snacks && snacks.length > 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.row}>
                    <Typography variant="subtitle_20_500" text={t('wine.foodPairing')} />
                    <CrownIcon />
                </View>
                <Button
                    text={t('common.generate')}
                    onPress={onGeneratePress}
                    containerStyle={styles.button}
                    inProgress={isGenerating}
                    disabled={!userModel.user?.hasPremium}
                />
            </View>
            <View style={styles.cardShadow}>
                <View style={styles.card}>
                    {hasSnacks ? (
                        snacks.map(snack => (
                            <View key={snack.label} style={styles.item}>
                                <Typography variant="h6" text={snack.label} />
                                {snack.items.map(item => (
                                    <Typography
                                        key={item}
                                        variant="body_500"
                                        text={`• ${item}`}
                                        style={styles.itemText}
                                    />
                                ))}
                            </View>
                        ))
                    ) : (
                        <View style={styles.emptyContainer}>
                            <Typography variant="body_500" text={t('wine.emptyFoodPairing')} style={styles.emptyText} />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
};
