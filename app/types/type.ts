
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

// export interface Card {
//     id: number;
//     icon?: string;
// }

export type Card = {
    slug: string;
    title: string;
};

export interface Feature {
    [key: string]: string;
}

export interface App {
    id: string;
    title: string;
    deployment: string;
    github: string;
    overview: string;
    description: string;
    features?: Feature[];
    technologiesUsed?: string[];
    installation?: string;
    usage?: string;
}

export interface AppData {
    apps: App[];
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

export interface PhotoData {
    images: Image[];
    positions: Record<string, Position>;
}


export interface User {
    name: string;
    email?: string;
    login: string;
}

export interface ReactionCounts {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
}

export interface Issue {
    url: string;
    repository_url: string;
    labels_url: string;
    comments_url: string;
    events_url: string;
    html_url: string;
    id: number;
    number: number;
    title: string;
    user: User;
    labels: string[];
    state: string;
    reactions: ReactionCounts;
    timeline_url: string;
    performed_via_github_app?: string | null;
    state_reason?: string | null;
}

export interface Repository {
    id: number;
    name: string;
    full_name: string;
    owner: User;
    html_url: string;
    description?: string;
    forks_url: string;
    issues_url: string;
    labels_url: string;
    releases_url: string;
    created_at: string;
    updated_at: string;
    pushed_at: string;
}

export interface PullRequest {
    title: string;
}

export interface Payload {
    action?: string;
    repository: Repository;
    pusher?: User;
    pull_request?: PullRequest;
    issue?: Issue;
    commits?: Commit[];
    timestamp: string;
    sender?: User;
    head_commit?: { timestamp?: string };

}

export interface Event {
    id: string;
    eventType: string;
    payload: Payload;
}

export interface Commit {
    id: string;
    tree_id: string;
    distinct: boolean;
    message: string;
    timestamp: string;
    url: string;
    author: User;
    committer: User;
    added: string[];
    removed: string[];
    modified: string[];
}