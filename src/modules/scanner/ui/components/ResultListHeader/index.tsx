import { useMemo } from 'react';
import { View } from 'react-native';
import { getStyles } from './styles';
import { useUiContext } from '@/UIProvider';
import { Typography } from '@/UIKit/Typography';
import { declOfWord } from '@/utils';
import { ResultHeader } from '../ResultHeader';
import { GlassWithWineIcon } from '@assets/icons/GlassWithWineIcon';
import { TasteCharacteristicItem } from '../TasteCharacteristicItem';
import { featuresModel } from '@/entities/features/FeaturesModel';
import { FeaturesKeysEnum } from '@/entities/features/enums/FeaturesKeysEnum';

interface ISelectedSmell {
    id: number;
    name: string;
    colorHex: string;
    reviewCount: number;
}

const MOCK_DATA = {
    id: 1,
    name: 'My Wine, Cabernet Sauvignon',
    vintage: 2021,
    image_url: 'https://picsum.photos/200/300',
    user: {
        id: 1,
        image_url: 'https://picsum.photos/200',
        firstName: 'Mike',
        lastName: 'Morris',
    },
    review_count: 123,
    review_average: 4.4,
    description:
        'A good bottle of wine is like a time machine. One sip, and you’re back to summer nights, candlelight dinners, and conversations that never ended.',
};
const SMELLS = [
    {
        id: 1,
        name: 'baked apple',
        colorHex: 'yellow',
        reviewCount: 123,
    },
    {
        id: 2,
        name: 'baked apple',
        colorHex: 'green',
        reviewCount: 123,
    },
    {
        id: 3,
        name: 'baked apple',
        colorHex: 'blue',
        reviewCount: 123,
    },
    {
        id: 4,
        name: 'baked apple',
        colorHex: 'purple',
        reviewCount: 123,
    },
    {
        id: 5,
        name: 'baked apple',
        colorHex: 'grey',
        reviewCount: 123,
    },
    {
        id: 6,
        name: 'baked apple',
        colorHex: 'pink',
        reviewCount: 123,
    },
];

const TASTES = [
    {
        id: 1,
        name: 'baked apple',
        colorHex: 'yellow',
        reviewCount: 123,
    },
    {
        id: 2,
        name: 'baked apple',
        colorHex: 'green',
        reviewCount: 123,
    },
    {
        id: 3,
        name: 'baked apple',
        colorHex: 'blue',
        reviewCount: 123,
    },
];

const CHARACTERISTICS = [
    {
        id: 1,
        name: 'Alcohol',
        description: 'Some text',
        levels: [
            { id: 1, name: 'Test1' },
            { id: 2, name: 'Test2' },
            { id: 3, name: 'Test3' },
            { id: 4, name: 'Test4' },
            { id: 5, name: 'Test5' },
        ],
        colorHex: 'red',
        isPremium: false,
        selectedIndex: 2,
    },
    {
        id: 2,
        name: 'Alcohol',
        description: 'Some text',
        levels: [
            { id: 1, name: 'Test' },
            { id: 2, name: 'Test' },
            { id: 3, name: 'Test' },
            { id: 4, name: 'Test' },
            { id: 5, name: 'Test' },
        ],
        colorHex: 'orange',
        isPremium: false,
        selectedIndex: 3,
    },
    {
        id: 3,
        name: 'Alcohol',
        description: 'Some text',
        levels: [
            { id: 1, name: 'Test' },
            { id: 2, name: 'Test' },
            { id: 3, name: 'Test' },
            { id: 4, name: 'Test' },
            { id: 5, name: 'Test' },
        ],
        colorHex: 'purple',
        isPremium: false,
        selectedIndex: 3,
    },
    {
        id: 4,
        name: 'Alcohol',
        description: 'Some text',
        levels: [
            { id: 1, name: 'Test' },
            { id: 2, name: 'Test' },
            { id: 3, name: 'Test' },
            { id: 4, name: 'Test' },
            { id: 5, name: 'Test' },
        ],
        colorHex: 'yellow',
        isPremium: true,
        selectedIndex: 3,
    },
    {
        id: 5,
        name: 'Alcohol',
        description: 'Some text',
        levels: [
            { id: 1, name: 'Test' },
            { id: 2, name: 'Test' },
            { id: 3, name: 'Test' },
            { id: 4, name: 'Test' },
            { id: 5, name: 'Test' },
        ],
        colorHex: 'green',
        isPremium: true,
        selectedIndex: 3,
    },
];

export const ResultListHeader = () => {
    const { colors, t } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);
    const isPremiumUser = useMemo(() =>
        featuresModel.features?.find(feature => feature.key === FeaturesKeysEnum.TASTING_NOTES)?.isEnabled || false,
    []);

    return (
        <View>
            <ResultHeader item={MOCK_DATA} />
            <View style={styles.tasted}>
                <Typography text={t('wine.tasted')} style={styles.tastedText} />
                <GlassWithWineIcon />
            </View>
            <Typography text={t('wine.selectedColor')} variant="h4" style={styles.title} />
            <View style={[styles.selectedColor, { backgroundColor: 'yellow' }]}>
                <Typography text={'straw'} variant="h5" />
            </View>
            <Typography text={t('wine.selectedSmells')} variant="h4" style={styles.title} />
            <View style={styles.mapListContainer}>
                {SMELLS.map((item: ISelectedSmell) => (
                    <View key={item.id} style={[styles.mapListItem, { backgroundColor: item.colorHex }]}>
                        <Typography text={item.name} />
                        <Typography
                            text={`(${declOfWord(
                                item.reviewCount,
                                t('scanner.reviewCount') as unknown as Array<string>,
                            )})`}
                            variant="subtitle_12_500"
                            style={styles.countText}
                        />
                    </View>
                ))}
            </View>
            <Typography text={t('wine.selectedTastes')} variant="h4" style={styles.title} />
            <View style={styles.mapListContainer}>
                {TASTES.map((item: ISelectedSmell) => (
                    <View key={item.id} style={[styles.mapListItem, { backgroundColor: item.colorHex }]}>
                        <Typography text={item.name} />
                        <Typography
                            text={`(${declOfWord(
                                item.reviewCount,
                                t('scanner.reviewCount') as unknown as Array<string>,
                            )})`}
                            variant="subtitle_12_500"
                            style={styles.countText}
                        />
                    </View>
                ))}
            </View>
            <Typography text={t('wine.selectedDetails')} variant="h4" style={styles.title} />
            <View style={styles.slidersListContainer}>
                {CHARACTERISTICS.map((item: any) => (
                    <TasteCharacteristicItem
                        key={item.id}
                        item={item}
                        value={item.selectedIndex}
                        isPremiumUser={isPremiumUser}
                        disabled={true}
                    />
                ))}
            </View>
            <Typography text={t('wine.reviews')} variant="h4" style={styles.title} />
        </View>
    );
};
