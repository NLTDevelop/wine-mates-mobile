import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { IWineDetails } from '@/entities/wine/types/IWineDetails';
import { WineListItem } from '@/UIKit/WineListItem';
import { WineShareModal } from '@/UIKit/WineShareModal';
import { useWineShareModal } from '@/UIKit/WineShareModal/presenters/useWineShareModal';

interface IProps {
    item: IWineDetails;
}

export const TastingResultHeader = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const {
        isShareModalVisible,
        onOpenShareModal,
        onCloseShareModal,
        onShareMessengerPress,
        onCopyWineLinkPress,
    } = useWineShareModal();

    return (
        <View style={styles.cardWrapper}>
            <WineListItem
                item={item}
                // footer={ }
                removeCardStyles
                showExpertRatingWithoutPremium
                onSharePress={onOpenShareModal}
            />
            <WineShareModal
                visible={isShareModalVisible}
                onClose={onCloseShareModal}
                onShareMessengerPress={onShareMessengerPress}
                onCopyLinkPress={onCopyWineLinkPress}
            />
        </View>
    );
};
