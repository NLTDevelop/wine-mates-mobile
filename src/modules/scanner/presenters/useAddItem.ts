import { useCallback, useState } from 'react';

export const useAddItem = (addToSelected: (text: string) => void) => {
    const [text, setText] = useState('');

    const handleAddPress = useCallback(() => {
        addToSelected(text);
    }, [addToSelected, text]);

    return { text, setText, handleAddPress };
};
