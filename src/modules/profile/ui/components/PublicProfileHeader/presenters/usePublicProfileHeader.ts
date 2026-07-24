import { useCallback, useMemo, useState } from 'react';
import { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import { localization } from '@/UIProvider/localization/Localization';

const COLLAPSED_BIO_LINES = 2;

export const usePublicProfileHeader = (bio?: string) => {
    const [expandedBio, setExpandedBio] = useState<string | null>(null);
    const [overflowBio, setOverflowBio] = useState<string | null>(null);

    const normalizedBio = useMemo(() => bio?.trim() || '', [bio]);
    const isBioExpanded = expandedBio === normalizedBio;
    const bioNumberOfLines = isBioExpanded ? undefined : COLLAPSED_BIO_LINES;
    const isBioToggleVisible = overflowBio === normalizedBio;
    const bioToggleText = localization.t(
        isBioExpanded ? 'publicProfile.showLess' : 'publicProfile.showMore',
    );

    const onBioTextLayout = useCallback(
        (event: NativeSyntheticEvent<TextLayoutEventData>) => {
            if (event.nativeEvent.lines.length > COLLAPSED_BIO_LINES) {
                setOverflowBio(normalizedBio);
            }
        },
        [normalizedBio],
    );

    const onBioTogglePress = useCallback(() => {
        setExpandedBio(currentBio => (currentBio === normalizedBio ? null : normalizedBio));
    }, [normalizedBio]);

    return {
        bio: normalizedBio,
        bioNumberOfLines,
        bioToggleText,
        isBioToggleVisible,
        onBioTextLayout,
        onBioTogglePress,
    };
};
