import { LatLng } from 'react-native-maps';

export interface IEventMapMarkerItem {
    id: number;
    coordinate: LatLng;
    isPartyEvent: boolean;
    onPress: () => void;
}
