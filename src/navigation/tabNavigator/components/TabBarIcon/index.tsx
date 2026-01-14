import { useUiContext } from '@/UIProvider';

interface Props {
    focused: boolean;
    Icon: React.ComponentType<{ color: string; width?: number; height?: number }>;
}

export const TabBarIcon = ({ focused, Icon }: Props) => {
    const { colors } = useUiContext();

    return <Icon width={24} height={24} color={focused ? colors.primary : colors.text_light} />;
};
