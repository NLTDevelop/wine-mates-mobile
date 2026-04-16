export interface IWineSetMockItem {
    id: number;
    title: string;
}

export interface IWineSetViewItem extends IWineSetMockItem {
    onEditPress: () => void;
}
