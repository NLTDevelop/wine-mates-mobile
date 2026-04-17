import { useMemo } from 'react';
import { useUiContext } from '@/UIProvider';
import { IFAQListItem } from '@/entities/FAQ/types/IFAQListItem';
import { getStyles } from './styles';
import { View } from 'react-native';
import { Typography } from '@/UIKit/Typography';
import { Collapse } from '@/UIKit/Collapse';

interface IProps {
    item: IFAQListItem;
}

export const FAQListItem = ({ item }: IProps) => {
    const { colors } = useUiContext();
    const styles = useMemo(() => getStyles(colors), [colors]);

    return (
        <View style={styles.container}>
            <Typography text={item.name} variant="subtitle_20_500" style={styles.title}/>
            {item.questions.map((question, index) => (
                <Collapse title={question.question} key={`${question.question}-${index}`}>
                    <Typography text={question.answer} variant="body_400" style={styles.answer}/>
                </Collapse>
            ))}
        </View>
    );
};
