import { HERO_MOVIES_SLIDES, MOCK_MOVIES } from '@/constants/appData';
import { xdHeight } from '@/constants/scaling';
import { useTab } from '@/context/TabContext';
import { Movie } from '@/types';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, ScrollView } from 'react-native';

export function useMovies() {
    const router = useRouter();
    const { setIsScrolled } = useTab();
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [heroIndex, setHeroIndex] = useState(0);

    useEffect(() => {
        return () => setIsScrolled(false);
    }, [setIsScrolled]);

    const scrollX = useRef(new Animated.Value(0)).current;
    const heroScrollRef = useRef<ScrollView>(null);

    const filteredMovies = useMemo(() => {
        let result = MOCK_MOVIES;
        if (activeCategory !== 'All') {
            result = result.filter((m) => m.genre === activeCategory);
        }
        if (searchQuery.trim()) {
            result = result.filter((m) =>
                m.title.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }
        return result;
    }, [activeCategory, searchQuery]);

    const currentHero = HERO_MOVIES_SLIDES[heroIndex];

    const handleMoviePress = (movie: Movie) => {
        router.push({
            pathname: '/movie/[id]',
            params: {
                id: movie.id,
                title: movie.title,
                genre: movie.genre,
                year: movie.year,
                duration: movie.duration,
                image: movie.image,
                description: movie.description,
            },
        });
    };

    const goToHero = (index: number) => {
        setHeroIndex(index);
    };

    const handleScroll = (event: any) => {
        const offsetY = event.nativeEvent.contentOffset.y;
        setIsScrolled(offsetY > xdHeight(60)); // Small threshold to show background early
    };

    return {
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        heroIndex,
        filteredMovies,
        currentHero,
        handleMoviePress,
        goToHero,
        handleScroll,
        scrollX,
        heroScrollRef
    };
}
