import { IColors } from '@/UIProvider/theme/IColors';
import { IUserStatus } from '@/modules-one-platform/base/entities/users/types/IUserStatus';
import { DateData } from 'react-native-calendars';
import { MarkingProps } from 'react-native-calendars/src/calendar/day/marking';

export interface IProps {
    date: DateData;
    state: '' | 'selected' | 'disabled' | 'inactive' | 'today';
    marking?: MarkingProps;
    colors: IColors;
    status?: IUserStatus;
    onPress?: (date: DateData) => void;
    minDate?: string;
    maxDate?: string;
}

export interface ICustomDayStyleDetails {
    isSelected: boolean;
    isRangeStart: boolean;
    isRangeEnd: boolean;
    isOutsideMonth: boolean;
    isToday: boolean;
    isDisabled: boolean;
}
