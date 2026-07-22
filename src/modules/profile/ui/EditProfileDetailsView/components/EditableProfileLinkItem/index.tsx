import { memo, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { CustomInput } from '@/UIKit/CustomInput';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { IEditableProfileLink } from '@/modules/profile/types/IEditableProfileLink';
import { getStyles } from './styles';

interface IProps {
    item: IEditableProfileLink;
}

const EditableProfileLinkItemComponent = ({ item }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <CustomInput
                value={item.value}
                onChangeText={item.onChangeText}
                placeholder={t('settings.wineryLink')}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
                containerStyle={styles.input}
            />
            <TouchableOpacity onPress={item.onDelete} style={styles.deleteButton} hitSlop={10}>
                <DeleteForeverIcon width={24} height={24} color={colors.primary} />
            </TouchableOpacity>
        </View>
    );
};

export const EditableProfileLinkItem = memo(EditableProfileLinkItemComponent);
