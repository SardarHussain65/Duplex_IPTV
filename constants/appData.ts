import { Channel, EPGSlot, FavoriteItem, FavoriteType, Movie, Series } from '@/types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ── Favorites ─────────────────────────────────────────────────

export const FAVORITE_CATEGORIES: { label: FavoriteType; icon: keyof typeof MaterialCommunityIcons.glyphMap }[] = [
    { label: 'Live TV', icon: 'television' },
    { label: 'Movies', icon: 'movie-outline' },
    { label: 'Series', icon: 'play-box-outline' },
];

export const MOCK_FAVORITES: FavoriteItem[] = [
    // Live TV
    { id: '1', name: 'Salin TV', type: 'Live TV', logo: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', category: 'Entertainment' },
    { id: '2', name: 'Global Bangle', type: 'Live TV', logo: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', category: 'Featured' },
    { id: '3', name: 'O Joo', type: 'Live TV', logo: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', category: 'Entertainment' },
    { id: '4', name: 'Globe News', type: 'Live TV', logo: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', category: 'News' },
    { id: '5', name: 'TMO', type: 'Live TV', logo: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', category: 'Music' },
    // Movies
    { id: '8', name: 'Defaulter', type: 'Movies', logo: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', category: 'Action', year: '2022', duration: '1h 20m', description: 'Defaulter action.' },
    { id: '9', name: 'Zootopia 2', type: 'Movies', logo: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', category: 'Animation', year: '2024', duration: '1h 20m', description: 'Zootopia 2 fun.' },
    { id: '10', name: 'Shadow P...', type: 'Movies', logo: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', category: 'Comedy', year: '2020', duration: '1h 20m', description: 'Shadow P comedy.' },
    { id: '11', name: 'David', type: 'Movies', logo: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', category: 'Thriller', year: '2021', duration: '1h 20m', description: 'David thriller.' },
    // Series
    { id: '14', name: 'Sesame Street', type: 'Series', logo: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', category: 'Kids', year: '2020', season: 'S5', description: 'Sesame street.' },
    { id: '15', name: 'Young Sheldon', type: 'Series', logo: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', category: 'Comedy', year: '2017', season: 'S2', description: 'Young sheldon.' },
    { id: '16', name: 'The Wrecking...', type: 'Series', logo: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', category: 'Action', year: '2022', season: 'S4', description: 'Wrecking crew.' },
    { id: '17', name: 'Paw Patrol', type: 'Series', logo: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', category: 'Kids', year: '2013', season: 'S6', description: 'Paw patrol.' },
];

// ── Live TV ───────────────────────────────────────────────────

export const LIVE_TV_CATEGORIES = [
    'All', 'Featured', 'Sport', 'Entertainment',
    'Movies', 'Kids', 'Music', 'Classics', 'News', 'Religious',
];

export const MOCK_CHANNELS: Channel[] = [
    { id: '1', name: 'Global Bangla', category: 'Featured', logo: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', streamHash: '1' },
    { id: '2', name: 'O Joo', category: 'Entertainment', logo: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', streamHash: '2' },
    { id: '3', name: 'Globe News', category: 'News', logo: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', streamHash: '3' },
    { id: '4', name: 'TMO', category: 'Music', logo: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', streamHash: '4' },
    { id: '5', name: 'Salin TV', category: 'Entertainment', logo: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', streamHash: '5' },
    { id: '6', name: 'Asshukur', category: 'Religious', logo: 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg', streamHash: '6' },
    { id: '7', name: 'ESPN Live', category: 'Sport', logo: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg', streamHash: '7' },
    { id: '8', name: 'Star Sports', category: 'Sport', logo: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', streamHash: '8' },
    { id: '9', name: 'Cartoon World', category: 'Kids', logo: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', streamHash: '9' },
    { id: '10', name: 'Toon Blast', category: 'Kids', logo: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', streamHash: '10' },
    { id: '11', name: 'CineMax', category: 'Movies', logo: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', streamHash: '11' },
    { id: '12', name: 'FilmBox', category: 'Movies', logo: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', streamHash: '12' },
    { id: '13', name: 'Gold Classics', category: 'Classics', logo: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', streamHash: '13' },
    { id: '14', name: 'Retro Cinema', category: 'Classics', logo: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', streamHash: '14' },
    { id: '15', name: 'MTV Hits', category: 'Music', logo: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', streamHash: '15' },
    { id: '16', name: 'BBC World', category: 'News', logo: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', streamHash: '16' },
    { id: '17', name: 'Star Plus', category: 'Featured', logo: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg', streamHash: '17' },
    { id: '18', name: 'Peace TV', category: 'Religious', logo: 'https://image.tmdb.org/t/p/w500/nkayOAUBUu4mMvyNf9iHSUiPjF1.jpg', streamHash: '18' },
];

export const MOCK_RECENTLY_WATCHED_CHANNELS = [
    { ...MOCK_CHANNELS[0], progress: 0.45 },
    { ...MOCK_CHANNELS[1], progress: 0.2 },
    { ...MOCK_CHANNELS[2], progress: 0.8 },
    { ...MOCK_CHANNELS[3], progress: 0.1 },
    { ...MOCK_CHANNELS[4], progress: 0.65 },
];

export const generateEPG = (channelName: string): EPGSlot[] => [
    {
        id: '1',
        title: `${channelName} Morning Show`,
        startTime: '1:00 PM',
        endTime: '1:30 PM',
        isLive: false,
        widthFactor: 180,
    },
    {
        id: '2',
        title: 'The World Poker Toure',
        startTime: '1:30 PM',
        endTime: '2:00 PM',
        isLive: true,
        widthFactor: 340,
    },
    {
        id: '3',
        title: 'The World Poker Toure',
        startTime: '2:00 PM',
        endTime: '2:30 PM',
        isLive: false,
        widthFactor: 280,
    },
    {
        id: '4',
        title: 'Late Night Special',
        startTime: '2:30 PM',
        endTime: '3:30 PM',
        isLive: false,
        widthFactor: 240,
    },
];

// ── Movies ────────────────────────────────────────────────────

export const MOVIES_CATEGORIES = ['All', 'Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Adventure'];

export const MOCK_MOVIES: Movie[] = [
    { id: '1', name: 'Rick and Morty', category: 'All', year: '2021', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', streamHash: 'm1' },
    { id: '2', name: 'Last Horizon', category: 'Drama', year: '2020', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', streamHash: 'm2' },
    { id: '3', name: 'Shadow P...', category: 'Comedy', year: '2022', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', streamHash: 'm3' },
    { id: '4', name: 'Zootopia 2', category: 'All', year: '2024', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', streamHash: 'm4' },
    { id: '5', name: 'Shadow P...', category: 'Comedy', year: '2020', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', streamHash: 'm5' },
    { id: '6', name: 'David', category: 'Thriller', year: '2021', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg', streamHash: 'm6' },
    { id: '7', name: 'CineMax Presents', category: 'Drama', year: '2023', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', streamHash: 'm7' },
    { id: '8', name: 'FilmBox Noir', category: 'Thriller', year: '2022', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', streamHash: 'm8' },
    { id: '9', name: 'Gold Classics', category: 'Comedy', year: '2019', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', streamHash: 'm9' },
    { id: '10', name: 'Retro Cinema', category: 'Drama', year: '2018', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', streamHash: 'm10' },
    { id: '11', name: 'BBC Exclusive', category: 'Thriller', year: '2021', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', streamHash: 'm11' },
    { id: '12', name: 'Star Chronicles', category: 'Comedy', year: '2022', duration: '1h 20m', description: '', logo: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg', streamHash: 'm12' },
];

export const MOCK_RECENTLY_WATCHED_MOVIES = [
    { ...MOCK_MOVIES[2], progress: 0.35 },
    { ...MOCK_MOVIES[5], progress: 0.6 },
    { ...MOCK_MOVIES[0], progress: 0.15 },
    { ...MOCK_MOVIES[3], progress: 0.9 },
    { ...MOCK_MOVIES[1], progress: 0.5 },
];

export const HERO_MOVIES_SLIDES: Movie[] = [
    {
        id: 'h1',
        name: 'Shadow Hunter',
        category: 'Action / Thriller',
        year: '2021',
        duration: '1h 48m',
        description:
            'A relentless detective unravels a web of secrets as he hunts a mysterious assassin lurking in the shadows.',
        logo: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
        streamHash: 'h1'
    },
    {
        id: 'h2',
        name: 'Greenland 2',
        category: 'Action / Drama',
        year: '2022',
        duration: '2h 05m',
        description:
            'A family scrambles for survival as a catastrophic comet event threatens to end life on Earth.',
        logo: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
        streamHash: 'h2'
    },
    {
        id: 'h3',
        name: 'Zootopia 2',
        category: 'Animation / Comedy',
        year: '2024',
        duration: '1h 58m',
        description:
            'Judy and Nick return for a brand-new adventure across the wild districts of Zootopia.',
        logo: 'https://image.tmdb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
        streamHash: 'h3'
    },
    {
        id: 'h4',
        name: 'The SpongeBob Movie',
        category: 'Animation / Family',
        year: '2020',
        duration: '1h 31m',
        description:
            'SpongeBob and friends must save Bikini Bottom from a diabolical plan that threatens their world.',
        logo: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
        streamHash: 'h4'
    },
];

// ── Series ────────────────────────────────────────────────────

export const SERIES_CATEGORIES = ['Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Adventure'];

export const MOCK_SERIES: Series[] = [
    { id: '1', name: 'Naruto Shippu...', category: 'Drama', year: '2007', season: 'S2', description: '', logo: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', streamHash: 's1' },
    { id: '2', name: 'Brooklyn Nin...', category: 'Comedy', year: '2013', season: 'S6', description: '', logo: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', streamHash: 's2' },
    { id: '3', name: 'Sesame stree...', category: 'Comedy', year: '2020', season: 'S5', description: '', logo: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', streamHash: 's3' },
    { id: '4', name: 'Young Sheldo...', category: 'Comedy', year: '2017', season: 'S2', description: '', logo: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', streamHash: 's4' },
    { id: '5', name: 'The Wrecking...', category: 'Drama', year: '2022', season: 'S4', description: '', logo: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', streamHash: 's5' },
    { id: '6', name: 'Paw Patrol', category: 'Comedy', year: '2013', season: 'S6', description: '', logo: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg', streamHash: 's6' },
    { id: '7', name: 'Breaking Bad', category: 'Thriller', year: '2008', season: 'S5', description: '', logo: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', streamHash: 's7' },
    { id: '8', name: 'True Detective', category: 'Thriller', year: '2014', season: 'S4', description: '', logo: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', streamHash: 's8' },
    { id: '9', name: 'The Mandalorian', category: 'Drama', year: '2019', season: 'S3', description: '', logo: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg', streamHash: 's9' },
    { id: '10', name: 'Stranger Things', category: 'Drama', year: '2016', season: 'S4', description: '', logo: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', streamHash: 's10' },
    { id: '11', name: 'The Crown', category: 'Drama', year: '2016', season: 'S6', description: '', logo: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', streamHash: 's11' },
    { id: '12', name: 'Ted Lasso', category: 'Comedy', year: '2020', season: 'S3', description: '', logo: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg', streamHash: 's12' },
];

export const MOCK_RECENTLY_WATCHED_SERIES = [
    { ...MOCK_SERIES[0], progress: 0.4 },
    { ...MOCK_SERIES[2], progress: 0.1 },
    { ...MOCK_SERIES[4], progress: 0.75 },
    { ...MOCK_SERIES[6], progress: 0.9 },
    { ...MOCK_SERIES[1], progress: 0.2 },
];

export const HERO_SERIES_SLIDES: Series[] = [

    {
        id: 'h1',
        name: '96 Minutes',
        category: 'Action / Thriller',
        year: '2021',
        season: 'S4',
        description:
            'A relentless detective unravels a web of secrets as he hunts a mysterious assassin lurking in the shadows.',
        logo: 'https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
        streamHash: 'h1'
    },
    {
        id: 'h2',
        name: 'Brooklyn Nine-Nine',
        category: 'Comedy / Crime',
        year: '2013',
        season: 'S6',
        description:
            'A talented but immature detective of the 99th precinct must adjust when a new commanding officer arrives.',
        logo: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
        streamHash: 'h2'
    },
    {
        id: 'h3',
        name: 'The Wrecking Crew',
        category: 'Action / Drama',
        year: '2022',
        season: 'S4',
        description:
            'A spec-ops team takes on high-risk missions across conflict zones while dealing with personal demons.',
        logo: 'https://image.tmdb.org/t/p/original/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg',
        streamHash: 'h3'
    },
    {
        id: 'h4',
        name: 'Young Sheldon',
        category: 'Comedy / Family',
        year: '2017',
        season: 'S2',
        description:
            'The early life of Sheldon Cooper is explored as a child genius navigating childhood in East Texas.',
        logo: 'https://image.tmdb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
        streamHash: 'h4'
    },
];
