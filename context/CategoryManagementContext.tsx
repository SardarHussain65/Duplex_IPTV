import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CategoryManagementContextType {
    lockedCategories: Set<string>;
    renamedCategories: Record<string, string>;
    lockCategory: (category: string) => void;
    unlockCategory: (category: string) => void;
    renameCategory: (originalName: string, newName: string) => void;
    getCategoryLabel: (category: string) => string;
    isCategoryLocked: (category: string) => boolean;
}

const CategoryManagementContext = createContext<CategoryManagementContextType | undefined>(undefined);

export const CategoryManagementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [lockedCategories, setLockedCategories] = useState<Set<string>>(new Set());
    const [renamedCategories, setRenamedCategories] = useState<Record<string, string>>({});

    const lockCategory = (category: string) => {
        setLockedCategories(prev => {
            const next = new Set(prev);
            next.add(category);
            return next;
        });
    };

    const unlockCategory = (category: string) => {
        setLockedCategories(prev => {
            const next = new Set(prev);
            next.delete(category);
            return next;
        });
    };

    const renameCategory = (originalName: string, newName: string) => {
        setRenamedCategories(prev => ({
            ...prev,
            [originalName]: newName,
        }));
    };

    const getCategoryLabel = (category: string) => {
        return renamedCategories[category] || category;
    };

    const isCategoryLocked = (category: string) => {
        return lockedCategories.has(category);
    };

    return (
        <CategoryManagementContext.Provider
            value={{
                lockedCategories,
                renamedCategories,
                lockCategory,
                unlockCategory,
                renameCategory,
                getCategoryLabel,
                isCategoryLocked,
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
