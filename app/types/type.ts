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

