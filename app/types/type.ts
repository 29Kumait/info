// app/types/index.ts

export interface Tile {
    x: number;
    y: number;
    url: string;
}

export interface Level {
    name: string;
    width: number;
    height: number;
    tiles: Tile[];
}

export interface TilesData {
    levels: Level[];
}

export interface Card {
    id: number;
    icon?: string;
}

export interface Image {
    fileId: string;
    name: string;
    url: string;
}

export interface Position {
    x: number;
    y: number;
    zIndex: number;
}
export type EventType = "push" | "pull_request" | "issues" | "unknown_event";

// export interface Event {
//     id: string;
//     eventType: EventType;
//     payload: string;
// }
// app/types/event.ts
export interface Event {
    id: string;
    eventType: string;
    payload: string;
}

export interface EventData {

    repository?: {
        full_name?: string;
    };
    pusher?: {
        name?: string;
    };
}

