import { ISmellSubgroup, IWineSmell } from '@/entities/wine/types/IWineSmell';
import { IWineAroma } from '@/entities/wine/types/IWineAroma';

interface IProps {
    data: IWineSmell[];
    selectedIndex: number;
    onSubgroupPress: (subgroup: ISmellSubgroup, groupId: number) => boolean;
    onShowModal: (groupId: number, subgroup: ISmellSubgroup) => void;
    onGroupPress: (groupId: number) => void;
    onSearchItemPress: (item: IWineAroma) => void;
}

export const useWineSmellViewPressHandlers = ({
    data,
    selectedIndex,
    onSubgroupPress,
    onShowModal,
    onGroupPress,
    onSearchItemPress,
}: IProps) => {
    const onSubgroupListItemPress = (item: ISmellSubgroup) => {
        return () => {
            const selectedGroup = data[selectedIndex];
            if (!selectedGroup) {
                return;
            }

            const isHandled = onSubgroupPress(item, selectedGroup.id);
            if (!isHandled) {
                onShowModal(selectedGroup.id, item);
            }
        };
    };

    const onGroupListItemPress = (item: IWineSmell) => {
        return () => {
            onGroupPress(item.id);
        };
    };

    const onSearchListItemPress = (item: IWineAroma) => {
        return () => {
            onSearchItemPress(item);
        };
    };

    return {
        onSubgroupListItemPress,
        onGroupListItemPress,
        onSearchListItemPress,
    };
};
