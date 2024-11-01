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

export interface Event {
    id: string;
    eventType: string;
    payload: Payload;
}

export interface Payload {
    repository: Repository;
    sender?: User;
    pusher?: {
        name?: string;
    };
}

export interface Repository {
    name: string;
    full_name: string;
    html_url: string;
    description?: string;
    owner: User;
    fork: boolean;
}

export interface User {
    login: string;
    avatar_url: string;
}

export interface Commit {
    id: string;
    message: string;
    url: string;
    author: { name: string };
}

export interface PullRequest {
    title?: string;
    url?: string;
    user?: { login?: string };
}

export interface Issue {
    title?: string;
    url?: string;
    user?: { login?: string };
}