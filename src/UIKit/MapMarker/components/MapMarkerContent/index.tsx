import { useMemo } from 'react';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { MapMarkerIcon } from '@assets/icons/MapMarkerIcon';
import { PartyIcon } from '@assets/icons/PartyIcon';
import { TastingIcon } from '@assets/icons/TastingIcon';
import { getStyles } from '../../styles';

interface IProps {
    isPartyEvent: boolean;
}

export const MapMarkerContent = ({ isPartyEvent }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.markerWrapper} collapsable={false}>
            <MapMarkerIcon bodyColor={colors.background_light} emoji="" />
            <View style={styles.centerIcon}>
                {isPartyEvent ? <PartyIcon width={23} height={23} /> : <TastingIcon width={23} height={23} />}
            </View>
        </View>
    );
};
