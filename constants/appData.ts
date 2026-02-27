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
    { id: '1', title: 'Salin TV', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg', genre: 'Entertainment' },
    { id: '2', title: 'Global Bangle', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg', genre: 'Featured' },
    { id: '3', title: 'O Joo', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg', genre: 'Entertainment' },
    { id: '4', title: 'Globe News', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg', genre: 'News' },
    { id: '5', title: 'TMO', type: 'Live TV', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg', genre: 'Music' },
    // Movies
    { id: '8', title: 'Defaulter', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg', genre: 'Action', year: '2022', duration: '1h 20m', description: 'Defaulter action.' },
    { id: '9', title: 'Zootopia 2', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg', genre: 'Animation', year: '2024', duration: '1h 20m', description: 'Zootopia 2 fun.' },
    { id: '10', title: 'Shadow P...', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg', genre: 'Comedy', year: '2020', duration: '1h 20m', description: 'Shadow P comedy.' },
    { id: '11', title: 'David', type: 'Movies', subtitle: '1h 20m', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg', genre: 'Thriller', year: '2021', duration: '1h 20m', description: 'David thriller.' },
    // Series
    { id: '14', title: 'Sesame Street', type: 'Series', subtitle: 'S5', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg', genre: 'Kids', year: '2020', season: 'S5', description: 'Sesame street.' },
    { id: '15', title: 'Young Sheldon', type: 'Series', subtitle: 'S2', image: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg', genre: 'Comedy', year: '2017', season: 'S2', description: 'Young sheldon.' },
    { id: '16', title: 'The Wrecking...', type: 'Series', subtitle: 'S4', image: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg', genre: 'Action', year: '2022', season: 'S4', description: 'Wrecking crew.' },
    { id: '17', title: 'Paw Patrol', type: 'Series', subtitle: 'S6', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg', genre: 'Kids', year: '2013', season: 'S6', description: 'Paw patrol.' },
];

// ── Live TV ───────────────────────────────────────────────────

export const LIVE_TV_CATEGORIES = [
    'All', 'Featured', 'Sport', 'Entertainment',
    'Movies', 'Kids', 'Music', 'Classics', 'News', 'Religious',
];

export const MOCK_CHANNELS: Channel[] = [
    { id: '1', name: 'Global Bangla', category: 'Featured', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '2', name: 'O Joo', category: 'Entertainment', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
    { id: '3', name: 'Globe News', category: 'News', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: '4', name: 'TMO', category: 'Music', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg' },
    { id: '5', name: 'Salin TV', category: 'Entertainment', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '6', name: 'Asshukur', category: 'Religious', image: 'https://image.tmdb.org/t/p/w500/6DrHO1jr3qVrViUO6s6kFiAGM7.jpg' },
    { id: '7', name: 'ESPN Live', category: 'Sport', image: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg' },
    { id: '8', name: 'Star Sports', category: 'Sport', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: '9', name: 'Cartoon World', category: 'Kids', image: 'https://image.tmdb.org/t/p/w500/oU7Oq2kFAAlGqbU4VoAE36g4hoI.jpg' },
    { id: '10', name: 'Toon Blast', category: 'Kids', image: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg' },
    { id: '11', name: 'CineMax', category: 'Movies', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: '12', name: 'FilmBox', category: 'Movies', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: '13', name: 'Gold Classics', category: 'Classics', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: '14', name: 'Retro Cinema', category: 'Classics', image: 'https://image.tmdb.org/t/p/w500/gPbM0MK8CP8A174rmUwGsADNYKD.jpg' },
    { id: '15', name: 'MTV Hits', category: 'Music', image: 'https://image.tmdb.org/t/p/w500/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg' },
    { id: '16', name: 'BBC World', category: 'News', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg' },
    { id: '17', name: 'Star Plus', category: 'Featured', image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
    { id: '18', name: 'Peace TV', category: 'Religious', image: 'https://image.tmdb.org/t/p/w500/nkayOAUBUu4mMvyNf9iHSUiPjF1.jpg' },
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
    { id: '1', title: 'Rick and Morty', genre: 'All', year: '2021', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '2', title: 'Last Horizon', genre: 'Drama', year: '2020', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
    { id: '3', title: 'Shadow P...', genre: 'Comedy', year: '2022', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: '4', title: 'Zootopia 2', genre: 'All', year: '2024', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '5', title: 'Shadow P...', genre: 'Comedy', year: '2020', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg' },
    { id: '6', title: 'David', genre: 'Thriller', year: '2021', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg' },
    { id: '7', title: 'CineMax Presents', genre: 'Drama', year: '2023', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: '8', title: 'FilmBox Noir', genre: 'Thriller', year: '2022', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: '9', title: 'Gold Classics', genre: 'Comedy', year: '2019', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: '10', title: 'Retro Cinema', genre: 'Drama', year: '2018', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: '11', title: 'BBC Exclusive', genre: 'Thriller', year: '2021', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg' },
    { id: '12', title: 'Star Chronicles', genre: 'Comedy', year: '2022', duration: '1h 20m', description: '', image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
];

export const HERO_MOVIES_SLIDES: Movie[] = [
    {
        id: 'h1',
        title: 'Shadow Hunter',
        genre: 'Action / Thriller',
        year: '2021',
        duration: '1h 48m',
        description:
            'A relentless detective unravels a web of secrets as he hunts a mysterious assassin lurking in the shadows.',
        image: 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    },
    {
        id: 'h2',
        title: 'Greenland 2',
        genre: 'Action / Drama',
        year: '2022',
        duration: '2h 05m',
        description:
            'A family scrambles for survival as a catastrophic comet event threatens to end life on Earth.',
        image: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
    },
    {
        id: 'h3',
        title: 'Zootopia 2',
        genre: 'Animation / Comedy',
        year: '2024',
        duration: '1h 58m',
        description:
            'Judy and Nick return for a brand-new adventure across the wild districts of Zootopia.',
        image: 'https://image.tmdb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    },
    {
        id: 'h4',
        title: 'The SpongeBob Movie',
        genre: 'Animation / Family',
        year: '2020',
        duration: '1h 31m',
        description:
            'SpongeBob and friends must save Bikini Bottom from a diabolical plan that threatens their world.',
        image: 'https://image.tmdb.org/t/p/original/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg',
    },
];

// ── Series ────────────────────────────────────────────────────

export const SERIES_CATEGORIES = ['Drama', 'Comedy', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Adventure'];

export const MOCK_SERIES: Series[] = [
    { id: '1', title: 'Naruto Shippu...', genre: 'Drama', year: '2007', season: 'S2', description: '', image: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
    { id: '2', title: 'Brooklyn Nin...', genre: 'Comedy', year: '2013', season: 'S6', description: '', image: 'https://image.tmdb.org/t/p/w500/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg' },
    { id: '3', title: 'Sesame stree...', genre: 'Comedy', year: '2020', season: 'S5', description: '', image: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg' },
    { id: '4', title: 'Young Sheldo...', genre: 'Comedy', year: '2017', season: 'S2', description: '', image: 'https://image.tmdb.org/t/p/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg' },
    { id: '5', title: 'The Wrecking...', genre: 'Drama', year: '2022', season: 'S4', description: '', image: 'https://image.tmdb.org/t/p/w500/rjkmN1dniUHVYAtwuV3Tji7FsDO.jpg' },
    { id: '6', title: 'Paw Patrol', genre: 'Comedy', year: '2013', season: 'S6', description: '', image: 'https://image.tmdb.org/t/p/w500/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg' },
    { id: '7', title: 'Breaking Bad', genre: 'Thriller', year: '2008', season: 'S5', description: '', image: 'https://image.tmdb.org/t/p/w500/9Gtg2DzBhmYamXBS1hKAhiwbBKS.jpg' },
    { id: '8', title: 'True Detective', genre: 'Thriller', year: '2014', season: 'S4', description: '', image: 'https://image.tmdb.org/t/p/w500/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg' },
    { id: '9', title: 'The Mandalorian', genre: 'Drama', year: '2019', season: 'S3', description: '', image: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg' },
    { id: '10', title: 'Stranger Things', genre: 'Drama', year: '2016', season: 'S4', description: '', image: 'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg' },
    { id: '11', title: 'The Crown', genre: 'Drama', year: '2016', season: 'S6', description: '', image: 'https://image.tmdb.org/t/p/w500/4EYPN5mVIhKLfxGruy7Dy41dTVn.jpg' },
    { id: '12', title: 'Ted Lasso', genre: 'Comedy', year: '2020', season: 'S3', description: '', image: 'https://image.tmdb.org/t/p/w500/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg' },
];

export const HERO_SERIES_SLIDES: Series[] = [
    {
        id: 'h1',
        title: '96 Minutes',
        genre: 'Action / Thriller',
        year: '2021',
        season: 'S4',
        description:
            'A relentless detective unravels a web of secrets as he hunts a mysterious assassin lurking in the shadows.',
        image: 'https://image.tmdb.org/t/p/original/8UlWHLMpgZm9bx6QYh0NFoq67TZ.jpg',
    },
    {
        id: 'h2',
        title: 'Brooklyn Nine-Nine',
        genre: 'Comedy / Crime',
        year: '2013',
        season: 'S6',
        description:
            'A talented but immature detective of the 99th precinct must adjust when a new commanding officer arrives.',
        image: 'https://image.tmdb.org/t/p/original/bOGkgRGdhrBYJSLpXaxhXVstddV.jpg',
    },
    {
        id: 'h3',
        title: 'The Wrecking Crew',
        genre: 'Action / Drama',
        year: '2022',
        season: 'S4',
        description:
            'A spec-ops team takes on high-risk missions across conflict zones while dealing with personal demons.',
        image: 'https://image.tmdb.org/t/p/original/xGuOF1T3WmPsAcQEQJfnG7Ud9f8.jpg',
    },
    {
        id: 'h4',
        title: 'Young Sheldon',
        genre: 'Comedy / Family',
        year: '2017',
        season: 'S2',
        description:
            'The early life of Sheldon Cooper is explored as a child genius navigating childhood in East Texas.',
        image: 'https://image.tmdb.org/t/p/original/sKCr78MXSLixwmZ8DyJLrpMsd15.jpg',
    },
];
