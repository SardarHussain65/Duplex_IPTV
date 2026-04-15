import { HERO_SERIES_SLIDES, MOCK_SERIES } from '@/constants/appData';
import { xdHeight } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { Series } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

export function useSeries() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const currentHero = HERO_SERIES_SLIDES[heroIndex];

    const handleSeriesPress = (series: Series) => {
        router.push({
            pathname: '/series-detail/[id]',
            params: {
                id: series.id,
                name: series.name,
                category: series.category,
                year: series.year,
                season: series.season,
                logo: series.logo,
                description: series.description,
                streamHash: series.streamHash,
                tvgId: series.tvgId,
                contentType: series.contentType,
                seriesTitle: series.seriesTitle,
                episodes: JSON.stringify(series.episodes || []),
            },
        });
    };

    const handleWatchNow = (series: Series) => {
        // Use the first episode's stream hash if available, otherwise fallback to series streamHash
        const firstEpisode = series.episodes?.[0];
        const streamHash = firstEpisode?.streamHash || series.streamHash;

        router.push({
            pathname: '/player/[id]',
            params: {
                id: series.id,
                name: firstEpisode?.name || series.name,
                category: series.category,
                year: series.year,
                duration: series.season,
                logo: series.logo,
                isSeries: 'true',
                streamHash: streamHash,
                contentType: 'SERIES',
                episodes: JSON.stringify(series.episodes || []),
            },
        });
    };

    const goToHero = (index: number) => {
        setHeroIndex(index);
    };


    const filteredSeries = useMemo(() => {
        let result = MOCK_SERIES;
        if (searchQuery.trim()) {
            result = result.filter((s: any) =>
                ((s.name || s.title) || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [searchQuery]);

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60));
    };

    return {
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        heroIndex,
        setHeroIndex,
        currentHero,
        handleSeriesPress,
        handleWatchNow,
        goToHero,
        filteredSeries,
        handleScroll,
    };
}
