import { DeviceStats } from "../../types";


export type MessageCategory = "log" | "zigbee";
export type JoinEvents = "TcDeviceInd" | "DeviceAnnceInd" | "NodeDescRsp" | "ActiveEpRsp";
export type ZigbeeEvent = "LinkData" | JoinEvents;

export interface ZigbeePayload {
    event: ZigbeeEvent;
    topic: string;
    payload: DeviceStats;
}



export interface WebsocketMessage {
    category: MessageCategory;
    payload: string | ZigbeePayload;
}

