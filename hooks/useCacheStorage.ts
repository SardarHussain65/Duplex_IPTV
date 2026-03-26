import { useState, useCallback, useEffect } from 'react';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface StorageSizes {
    imageCache: number;
    videoCache: number;
    epgData: number;
    appData: number;
    total: number;
}

const INITIAL_SIZES: StorageSizes = {
    imageCache: 0,
    videoCache: 0,
    epgData: 0,
    appData: 0,
    total: 0,
};

const VIDEO_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.ts'];
const IMAGE_EXTENSIONS = ['.jpg', '.png', '.webp', '.jpeg', '.gif'];

export function useCacheStorage() {
    const [sizes, setSizes] = useState<StorageSizes>(INITIAL_SIZES);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    const formatSize = (bytes: number | null): string => {
        if (!bytes || bytes === 0) return '0 B';
        const k = 1024;
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getDirectorySize = async (
        uri: string, 
        isKnownCache: boolean = false, 
        type: 'image' | 'video' | 'epg' | 'all' = 'all'
    ): Promise<number> => {
        try {
            const info = await FileSystem.getInfoAsync(uri);
            if (!info.exists) return 0;
            
            if (!info.isDirectory) {
                const lowerUri = uri.toLowerCase();
                if (type === 'image') {
                    if (isKnownCache) return (info as any).size || 0;
                    if (IMAGE_EXTENSIONS.some(ext => lowerUri.endsWith(ext))) return (info as any).size || 0;
                    return 0;
                }
                if (type === 'video') {
                    if (isKnownCache) return (info as any).size || 0;
                    if (
                        VIDEO_EXTENSIONS.some(ext => lowerUri.endsWith(ext)) ||
                        lowerUri.includes('video') ||
                        lowerUri.includes('media') ||
                        lowerUri.includes('buffer') ||
                        lowerUri.includes('exo') ||
                        lowerUri.includes('asset') ||
                        lowerUri.includes('stream')
                    ) return (info as any).size || 0;
                    return 0;
                }
                if (type === 'epg') {
                    if (isKnownCache) return (info as any).size || 0;
                    if (
                        lowerUri.includes('epg') || 
                        lowerUri.includes('storage') || 
                        lowerUri.includes('sqlite') ||
                        lowerUri.includes('db') ||
                        lowerUri.includes('database') ||
                        lowerUri.includes('metadata') ||
                        lowerUri.includes('mmkv') ||
                        lowerUri.includes('playlist') ||
                        lowerUri.includes('channel') ||
                        lowerUri.endsWith('.db') ||
                        lowerUri.endsWith('.sqlite') ||
                        lowerUri.endsWith('.json') // Some apps store playlist as JSON in documents
                    ) return (info as any).size || 0;
                    return 0;
                }
                return (info as any).size || 0;
            }

            const files = await FileSystem.readDirectoryAsync(uri);
            const results = await Promise.all(
                files.map(async (file) => {
                    const fileUri = uri.endsWith('/') ? `${uri}${file}` : `${uri}/${file}`;
                    const lowerFile = file.toLowerCase();
                    
                    let nextIsKnownCache = isKnownCache;
                    if (type === 'image') {
                        if (lowerFile.includes('cache') || lowerFile.includes('glide') || lowerFile.includes('image_manager')) {
                            nextIsKnownCache = true;
                        }
                    } else if (type === 'video') {
                        if (
                            lowerFile.includes('video') || 
                            lowerFile.includes('exo') || 
                            lowerFile.includes('avasset') || 
                            lowerFile.includes('media') ||
                            lowerFile.includes('buffer') ||
                            lowerFile.includes('stream')
                        ) {
                            nextIsKnownCache = true;
                        }
                    } else if (type === 'epg') {
                        if (
                            lowerFile.includes('epg') || 
                            lowerFile.includes('query') || 
                            lowerFile.includes('storage') || 
                            lowerFile.includes('sqlite') || 
                            lowerFile.includes('db') ||
                            lowerFile.includes('database') ||
                            lowerFile.includes('metadata') ||
                            lowerFile.includes('mmkv') ||
                            lowerFile.includes('playlist') ||
                            lowerFile.includes('channel')
                        ) {
                            nextIsKnownCache = true;
                        }
                    }

                    return getDirectorySize(fileUri, nextIsKnownCache, type);
                })
            );

            return results.reduce((acc: number, size: number) => acc + size, 0);
        } catch (error) {
            return 0;
        }
    };

    const calculateSizes = useCallback(async () => {
        setIsLoading(true);
        try {
            const cacheDir = FileSystem.cacheDirectory || '';
            const docDir = FileSystem.documentDirectory || '';
            
            // 1. Image Cache
            const imageCacheSize = await getDirectorySize(cacheDir, false, 'image');

            // 2. Video Cache
            const videoCacheSize = await getDirectorySize(cacheDir, false, 'video');

            // 3. EPG Data
            const epgDataSize = await getDirectorySize(docDir, false, 'epg');

            // 4. App Data (Remaining document directory)
            const fullDocSize = await getDirectorySize(docDir, false, 'all');
            const appDataSize = Math.max(0, fullDocSize - epgDataSize);

            setSizes({
                imageCache: imageCacheSize,
                videoCache: videoCacheSize,
                epgData: epgDataSize,
                appData: appDataSize,
                total: imageCacheSize + videoCacheSize + fullDocSize, 
            });
        } catch (error) {
            console.error('Failed to calculate storage sizes:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearAllCache = async () => {
        try {
            setIsLoading(true);
            
            // 1. Clear Image Cache
            await Image.clearDiskCache();
            await Image.clearMemoryCache();

            // 2. Clear React Query Cache
            queryClient.clear();

            // 3. Clear AsyncStorage
            await AsyncStorage.clear(); 
            
            // 4. Clear Temporary Cache Directory
            try {
                const cacheDir = FileSystem.cacheDirectory;
                if (cacheDir) {
                    const files = await FileSystem.readDirectoryAsync(cacheDir);
                    for (const file of files) {
                        try {
                            await FileSystem.deleteAsync(`${cacheDir}${file}`, { idempotent: true });
                        } catch (e) {}
                    }
                }
            } catch (e) {}

            // 5. Recalculate
            await calculateSizes();
            
            Alert.alert('Success', 'All cache has been cleared successfully.');
        } catch (error) {
            console.error('Failed to clear cache:', error);
            Alert.alert('Error', 'Failed to clear some cache components.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        calculateSizes();
    }, [calculateSizes]);

    return {
        sizes,
        isLoading,
        formatSize,
        calculateSizes,
        clearAllCache,
    };
}
