export interface IWineListItem {
    id: number;
    name: string;
    vintage: number;
    image_url: string;
    user: {
        id: number;
        image_url: string;
        firstName: string;
        lastName: string;
    }
    review_count: number;
    review_average: number;
    description: string;
}
