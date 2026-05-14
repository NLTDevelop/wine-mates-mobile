import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { WineListItem } from '@/UIKit/WineListItem';

interface IProps {
    item: IWineDetails;
}

export const TastingResultHeader = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.cardWrapper}>
            <WineListItem
                item={item}
                // footer={ }
                removeCardStyles
                showExpertRatingWithoutPremium={false}
            />
        </View>
    );
};
