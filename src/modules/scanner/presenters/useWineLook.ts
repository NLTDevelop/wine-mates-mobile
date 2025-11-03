import { useState } from "react";

const MockedData = {
    colors: [
        {
            color: '#FFF9E5',
            colorName: 'straw',
        },
        {
            color: '#FFE999',
            colorName: 'lemon',
        },
        {
            color: '#EFDB78',
            colorName: 'yellow',
        },
        {
            color: '#F3D377',
            colorName: 'golden',
        },
        {
            color: '#FFC700',
            colorName: 'amber',
        },
        {
            color: '#A99E78',
            colorName: 'green',
        },
    ],
};

export const useWineLook = () => {
    const [perlage, setPerlage] = useState(0);
    const [mousse, setMousse] = useState(0);
    
    return { data: MockedData, perlage, setPerlage, mousse, setMousse };
};
