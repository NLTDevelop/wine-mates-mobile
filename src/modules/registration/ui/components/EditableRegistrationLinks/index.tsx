import { useCallback, useMemo } from 'react';
import { FlatList, ListRenderItem, TouchableOpacity, View } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { CustomInput } from '@/UIKit/CustomInput';
import { Typography } from '@/UIKit/Typography';
import { DeleteForeverIcon } from '@assets/icons/DeleteForeverIcon';
import { IEditableRegistrationLink } from '@/modules/registration/types/IEditableRegistrationLink';
import { getStyles } from './styles';

interface IProps {
    items: IEditableRegistrationLink[];
    label: string;
    placeholder: string;
    addText: string;
    onAdd: () => void;
}

export const EditableRegistrationLinks = ({ items, label, placeholder, addText, onAdd }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const renderItem = useCallback<ListRenderItem<IEditableRegistrationLink>>(
        ({ item }) => (
            <View style={styles.item}>
                <CustomInput
                    value={item.value}
                    onChangeText={item.onChangeText}
                    placeholder={placeholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="url"
                    containerStyle={styles.input}
                />
                <TouchableOpacity onPress={item.onDelete} style={styles.deleteButton} hitSlop={10}>
                    <DeleteForeverIcon width={24} height={24} color={colors.primary} />
                </TouchableOpacity>
            </View>
        ),
        [colors.primary, placeholder, styles],
    );
    const keyExtractor = useCallback((item: IEditableRegistrationLink) => item.id, []);

    return (
        <View>
            <Typography text={label} variant="body_500" style={styles.label} />
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={keyExtractor}
                scrollEnabled={false}
                contentContainerStyle={styles.list}
            />
            <TouchableOpacity onPress={onAdd} style={styles.addButton}>
                <Typography text={addText} variant="body_500" style={styles.addButtonText} />
            </TouchableOpacity>
        </View>
    );
};
