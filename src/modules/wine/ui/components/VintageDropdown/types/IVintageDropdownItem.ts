import { IDropdownItem } from "@/UIKit/CustomDropdown/types/IDropdownItem";

export interface IVintageDropdownItem extends IDropdownItem {
    averageUserRating?: number | null;
    averageExpertRating?: number | null;
    totalReviews?: number;
    countExpertRating?: number | null;
}