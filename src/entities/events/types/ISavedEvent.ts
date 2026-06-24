import { SavedEventStatus } from "../enums/SavedEventStatus";
import { IEvent } from "./IEvent";


export interface ISavedEvent extends IEvent {
    isSaved: boolean;
    status?: SavedEventStatus;
}