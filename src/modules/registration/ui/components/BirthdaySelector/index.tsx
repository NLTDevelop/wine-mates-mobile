import { useMemo } from 'react';
import { getStyles } from './styles';
import { TouchableOpacity } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@/assets/icons/ArrowDownIcon';
import { useBirthdaySelector } from '@/modules/registration/presenters/useBirthdaySelector';

interface IProps {
    date: string | null
    onChangeBirthdayDate: (date: string) => void
}

export const BirthdaySelector = ({ date, onChangeBirthdayDate }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { handlePress, isOpened } = useBirthdaySelector(onChangeBirthdayDate);

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={handlePress}>
                <Typography variant="h6" text={date || t('registration.birthday')} />
                <ArrowDownIcon rotate={isOpened ? 180 : 0} />
            </TouchableOpacity>
          
        </>
    );
};
