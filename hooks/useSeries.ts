import { HERO_SERIES_SLIDES, MOCK_SERIES } from '@/constants/appData';
import { xdHeight } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { Series } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';

export function useSeries() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('Drama');
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
                title: series.title,
                genre: series.genre,
                year: series.year,
                season: series.season,
                image: series.image,
                description: series.description,
            },
        });
    };

    const filteredSeries = useMemo(() => {
        let result = MOCK_SERIES;
        if (searchQuery.trim()) {
            result = result.filter((s) =>
                s.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        filteredSeries,
        handleScroll,
    };
}
