import { useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Flag from 'react-native-round-flags';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { ArrowDownIcon } from '@assets/icons/ArrowDownIcon';
import { getStyles } from './styles';
import { useLanguageSelector } from './presenters/useLanguageSelector';
import { LanguagePickerBottomSheet } from '../LanguagePickerBottomSheet';

interface IProps {
    value: string;
    onChange: (value: string) => void;
}

export const LanguageSelector = ({ value, onChange }: IProps) => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const { modalRef, selectedLanguage, isMounted, isOpened, onOpen, onClose, onDismiss, onSelect } =
        useLanguageSelector({
            value,
            onChange,
        });

    const renderFlag = () => {
        if (!selectedLanguage) {
            return null;
        }

        if (selectedLanguage.countryCode === 'BY') {
            return <Typography variant="h6" text="🇧🇾" />;
        }

        try {
            return <Flag code={selectedLanguage.countryCode} style={styles.flag} />;
        } catch {
            return null;
        }
    };

    return (
        <>
            <TouchableOpacity style={styles.container} onPress={onOpen}>
                <View style={styles.leftContent}>
                    {renderFlag()}
                    <Typography
                        variant="h6"
                        text={selectedLanguage?.name || t('event.eventLanguage')}
                        style={selectedLanguage ? styles.languageText : styles.placeholderText}
                    />
                </View>
                <View style={styles.rightContent}>
                    {selectedLanguage ? (
                        <Typography variant="h6" text={selectedLanguage.code} style={styles.code} />
                    ) : null}
                    <ArrowDownIcon rotate={isOpened ? 180 : 0} />
                </View>
            </TouchableOpacity>

            {isMounted && (
                <LanguagePickerBottomSheet
                    modalRef={modalRef}
                    onSelect={onSelect}
                    onClose={onClose}
                    onDismiss={onDismiss}
                />
            )}
        </>
    );
};
