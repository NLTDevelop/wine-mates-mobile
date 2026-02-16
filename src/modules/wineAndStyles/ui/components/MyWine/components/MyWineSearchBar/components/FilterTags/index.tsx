import { ScrollView } from 'react-native';
import { useUiContext } from '@/UIProvider';
import { getStyles } from './styles';
import { FilterTag } from '../FilterTag';
import { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

export interface IFilterTagItem {
    label: string;
    value: string | number;
    type: 'sort' | 'color' | 'type';
}

interface IProps {
    tags: IFilterTagItem[];
    onRemoveTag: (tag: IFilterTagItem) => void;
}

const FilterTagsComponent = ({ tags, onRemoveTag }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    if (tags.length === 0) {
        return null;
    }

    return (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
        >
            {tags.map((tag, index) => (
                <FilterTag
                    key={`${tag.type}-${tag.value}-${index}`}
                    label={tag.label}
                    onRemove={() => onRemoveTag(tag)}
                />
            ))}
        </ScrollView>
    );
};

export const FilterTags = observer(FilterTagsComponent);
