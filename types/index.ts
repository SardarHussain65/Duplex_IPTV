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
    streamUrl?: string;
}


export type Channel = {
    id: string;
    name: string;
    category: string;
    logo: string;
    streamUrl: string;
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
    streamUrl: string;
    tvgId?: string;
    contentType?: string;
};

export type SeriesEpisode = {
    name: string;
    seasonNumber: number;
    episodeNumber: number;
    streamUrl: string;
    tvgLogo?: string;
    seriesTitle?: string;
};

export type Series = {
    id: string;
    name: string;
    category: string;
    year: string;
    season: string;
    logo: string;
    description: string;
    streamUrl: string;
    tvgId?: string;
    contentType?: string;
    seriesTitle?: string;
    episodes?: SeriesEpisode[];
};


export type EPGSlot = {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    isLive?: boolean;
    widthFactor: number;
};
