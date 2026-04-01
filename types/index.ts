export type FavoriteType = 'Live TV' | 'Movies' | 'Series';

export interface FavoriteItem {
    id: string;
    name: string;
    type: FavoriteType;
    logo: string;
    category?: string;
    year?: string;
    duration?: string;
    season?: string;
    description?: string;
    tvgId?: string;
    streamHash?: string;
}

export type Channel = {
    id: string;
    name: string;
    category: string;
    logo: string;
    streamHash: string;
    tvgId?: string;
    contentType?: string;
};

export type Movie = {
    id: string;
    name: string;
    category: string;
    year: string;
    duration: string;
    logo: string;
    description: string;
    streamHash: string;
    tvgId?: string;
    contentType?: string;
};

export type Series = {
    id: string;
    name: string;
    category: string;
    year: string;
    season: string;
    logo: string;
    description: string;
    streamHash: string;
    tvgId?: string;
    contentType?: string;
    seriesTitle?: string;
};

export type EPGSlot = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    isLive?: boolean;
    widthFactor: number;
};
