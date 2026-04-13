import { useCallback, useMemo } from 'react';
import { Pressable, View } from 'react-native';
import {
    BottomSheetBackdrop,
    BottomSheetBackdropProps,
    BottomSheetModal,
    BottomSheetView,
    WINDOW_HEIGHT,
} from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { CrossIcon } from '@assets/icons/CrossIcon';
import { getStyles } from './styles';
import { WineExperienceLevelEnum } from '@/entities/users/enums/WineExperienceLevelEnum';
import { LevelButton } from '@/modules/registration/ui/components/LevelButton';
import { WineLoverIcon } from '@assets/icons/WineLoverIcon';
import { WineExpertIcon } from '@assets/icons/WineExpertIcon';
import { WinemakerIcon } from '@assets/icons/WinemakerIcon';

interface IProps {
    modalRef: React.RefObject<BottomSheetModal | null>;
    selectedValue: WineExperienceLevelEnum;
    onSelect: (value: WineExperienceLevelEnum) => void;
    onClose: () => void;
}

export const SelectExpertiseBottomSheet = ({ modalRef, selectedValue, onSelect, onClose }: IProps) => {
    const { colors, t } = useUiContext();
    const { top, bottom } = useSafeAreaInsets();
    const styles = useMemo(() => getStyles(colors, bottom, top), [colors, bottom, top]);

    const renderBackdrop = useCallback(
        (props: BottomSheetBackdropProps) => (
            <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
        ),
        []
    );

    return (
        <BottomSheetModal
            ref={modalRef}
            topInset={top}
            enablePanDownToClose
            enableDynamicSizing
            maxDynamicContentSize={WINDOW_HEIGHT}
            handleComponent={() => null}
            backdropComponent={renderBackdrop}
            backgroundStyle={styles.bottomSheetContainer}
            onDismiss={onClose}
        >
            <BottomSheetView style={styles.container}>
                <View style={styles.header}>
                    <View style={styles.headerSpacer} />
                    <Typography variant="h4" text={t('settings.expertise')} />
                    <View style={styles.headerRight}>
                        <Typography
                            variant="body_400"
                            text={t(`wineLevel.${selectedValue}`)}
                            style={styles.selectedText}
                            numberOfLines={1}
                        />
                        <View style={styles.headerIconSpacer} />
                        <Pressable style={styles.closeButton} onPress={onClose} hitSlop={20}>
                            <CrossIcon />
                        </Pressable>
                    </View>
                </View>

                <View style={styles.buttonsContainer}>
                    <LevelButton
                        text={t('wineLevel.lover')}
                        typeIcon={<WineLoverIcon />}
                        onPress={() => onSelect(WineExperienceLevelEnum.LOVER)}
                    />
                    <LevelButton
                        text={t('wineLevel.expert')}
                        typeIcon={<WineExpertIcon />}
                        onPress={() => onSelect(WineExperienceLevelEnum.EXPERT)}
                    />
                    <LevelButton
                        text={t('wineLevel.creator')}
                        typeIcon={<WinemakerIcon />}
                        onPress={() => onSelect(WineExperienceLevelEnum.CREATOR)}
                    />
                </View>
            </BottomSheetView>
        </BottomSheetModal>
    );
};

