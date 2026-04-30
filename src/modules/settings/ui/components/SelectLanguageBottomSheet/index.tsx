import { useCallback, useMemo } from 'react';
import { View, TouchableOpacity, FlatList } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { BottomModal } from '@/UIKit/BottomModal/ui';
import { getStyles } from './styles';
import { TickIcon } from '@assets/icons/TickIcon';

interface IProps {
    isVisible: boolean;
    onItemPress: (item: string) => void;
    onClose: () => void;
}

export const SelectLanguageBottomSheet = ({ isVisible, onItemPress, onClose }: IProps) => {
    const { colors, t, locales, locale } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const keyExtractor = useCallback((item: string) => `${item}`, []);
    const createOnItemPress = useCallback((item: string) => {
        return () => {
            onItemPress(item);
        };
    }, [onItemPress]);

    const renderItem = useCallback(({ item }: { item: string }) => {
        const isSelected = locale === item;
        return (
            <TouchableOpacity onPress={createOnItemPress(item)} style={styles.item}>
                <Typography
                    variant="h5"
                    text={t(`locale.${item}`)}
                    style={isSelected ? styles.selectedText : undefined}
                />
                {isSelected && <TickIcon width={24} height={24} color={colors.icon_primary} />}
            </TouchableOpacity>
        );
    }, [createOnItemPress, styles, colors, t, locale]);

    return (
        <BottomModal visible={isVisible} onClose={onClose} title={t('settings.language')}>
            <View style={styles.container}>
                <FlatList
                    data={locales}
                    keyExtractor={keyExtractor}
                    renderItem={renderItem}
                    contentContainerStyle={styles.contentContainer}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </BottomModal>
    );
};
