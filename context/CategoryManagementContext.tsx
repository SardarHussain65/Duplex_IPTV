import { useParentalControls } from '@/lib/api/hooks/useParentalControls';
import React, { createContext, ReactNode, useContext } from 'react';

interface CategoryManagementContextType {
    lockCategory: (category: string, contentType: 'MOVIE' | 'SERIES' | 'LIVE') => Promise<void>;
    unlockCategory: (category: string, contentType: 'MOVIE' | 'SERIES' | 'LIVE') => Promise<void>;
    renameCategory: (originalName: string, newName: string, contentType: 'MOVIE' | 'SERIES' | 'LIVE') => Promise<void>;
    getCategoryLabel: (category: string) => string;
}

const CategoryManagementContext = createContext<CategoryManagementContextType | undefined>(undefined);

export const CategoryManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addParentalControl, removeParentalControl, renamePlaylistCategory } = useParentalControls();

    const lockCategory = async (category: string, contentType: 'MOVIE' | 'SERIES' | 'LIVE') => {
        try {
            await addParentalControl({
                name: category,
                type: contentType,
                isCategoryLock: true,
                category: category,
            });
        } catch (error) {
            console.error('Failed to lock category:', error);
            throw error;
        }
    };

    const unlockCategory = async (category: string, contentType: 'MOVIE' | 'SERIES' | 'LIVE') => {
        try {
            await removeParentalControl({
                category: category,
                type: contentType,
            });
        } catch (error) {
            console.error('Failed to unlock category:', error);
            throw error;
        }
    };

    const renameCategory = async (originalName: string, newName: string, contentType: 'MOVIE' | 'SERIES' | 'LIVE') => {
        try {
            await renamePlaylistCategory({
                category: originalName,
                renamedCategory: newName,
                contentType,
            });
        } catch (error) {
            console.error('Failed to rename category:', error);
            throw error;
        }
    };

    /**
     * @deprecated Use the renamedCategory field from categories API instead.
     */
    const getCategoryLabel = (category: string) => {
        return category;
    };
    return (
        <CategoryManagementContext.Provider
            value={{
                lockCategory,
                unlockCategory,
                renameCategory,
                getCategoryLabel,
            }}
        >
            {children}
        </CategoryManagementContext.Provider>
    );
};

export const useCategoryManagement = () => {
    const context = useContext(CategoryManagementContext);
    if (!context) {
        throw new Error('useCategoryManagement must be used within a CategoryManagementProvider');
    }
    return context;
};
