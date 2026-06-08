import { IEvent } from "./IEvent";
import { AppliedEventStatus } from '../enums/AppliedEventStatus';

export interface IAppliedEvent {
    id: number;
    event: IEvent;
    status: AppliedEventStatus;
    createdAt: string;
}
