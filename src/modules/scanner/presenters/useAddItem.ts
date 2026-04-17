import { useCallback, useState } from 'react';
import { Keyboard } from 'react-native';

export const useAddItem = (addToSelected: (text: string) => void) => {
    const [text, setText] = useState('');

    const handleAddPress = useCallback(() => {
        addToSelected(text);
        setText('');
        Keyboard.dismiss();
    }, [addToSelected, text]);

    return { text, setText, handleAddPress };
};
