export type FavoriteType = 'Live TV' | 'Movies' | 'Series';

export interface FavoriteItem {
    id: string;
    title: string;
    type: FavoriteType;
    image: string;
    subtitle?: string;
    genre?: string;
    year?: string;
    duration?: string;
    season?: string;
    description?: string;
}

export type Channel = {
    id: string;
    name: string;
    category: string;
    image: string;
};

export type Movie = {
    id: string;
    title: string;
    genre: string;
    year: string;
    duration: string;
    image: string;
    description: string;
};

export type Series = {
    id: string;
    title: string;
    genre: string;
    year: string;
    season: string;
    image: string;
    description: string;
};

export type EPGSlot = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    isLive?: boolean;
    widthFactor: number;
};
