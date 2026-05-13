import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';

export const useAddItem = (addToSelected: (text: string) => void) => {
    const [text, setText] = useState('');

    const onAddPress = useCallback(() => {
        addToSelected(text);
        setText('');
        Keyboard.dismiss();
    }, [addToSelected, text]);

    return { text, setText, onAddPress };
};
