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

export type EventType =
    | "push"
    | "pull_request"
    | "issues"
    | "issue_comment"
    | "fork"
    | "star"
    | "default";
// Update types/type.ts
export interface Repository {
    name?: string;
    full_name?: string;
    html_url?: string;
    description?: string;
    owner?: { login: string; avatar_url?: string };
    fork?: boolean;
}

export interface Pusher {
    name?: string;
}

export interface PullRequest {
    title?: string;
}

export interface Issue {
    title?: string;
}

export interface Payload {
    timestamp?: string;
    repository?: Repository;
    pusher?: Pusher;
    pull_request?: PullRequest;
    issue?: Issue;
}

export interface Event {
    id: string;
    eventType: string;
    payload?: Payload;
}
