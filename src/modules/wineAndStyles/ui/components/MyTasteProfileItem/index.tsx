import { useMemo } from 'react';
import { getStyles } from './styles';
import { View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { DropdownButton } from '@/UIKit/DropdownButton';

interface IProps {
    title: string;
}

export const MyTasteProfileItem = ({ title }: IProps) => {
    //TODO
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View>
            <DropdownButton title={title}>
              <View></View>
            </DropdownButton>
        </View>
    );
};
