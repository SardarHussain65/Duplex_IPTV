/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — Tab Context
 *  Shared state for the active top-nav tab.
 *  All 6 items in the nav bar (including icon buttons) are tabs.
 * ─────────────────────────────────────────────────────────────
 */

import React, { createContext, useCallback, useContext, useState } from 'react';

// ── Tab type ──────────────────────────────────────────────────
export type Tab =
    | 'live-tv'
    | 'movies'
    | 'series'
    | 'favorites'
    | 'parental-control'
    | 'settings';

// ── Context shape ────────────────────────────────────────────
interface TabContextValue {
    activeTab: Tab;
    setActiveTab: (tab: Tab) => void;
    isScrolled: boolean;
    setIsScrolled: (scrolled: boolean) => void;
    isParentalModalVisible: boolean;
    setParentalModalVisible: (visible: boolean) => void;
    isParentalUnlocked: boolean;
    setParentalUnlocked: (unlocked: boolean) => void;
}

// ── Context ──────────────────────────────────────────────────
const TabContext = createContext<TabContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────
export const TabContextProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [activeTab, setActiveTabState] = useState<Tab>('live-tv');
    const [isScrolled, setIsScrolled] = useState(false);
    const [isParentalModalVisible, setParentalModalVisible] = useState(false);
    const [isParentalUnlocked, setParentalUnlocked] = useState(false);

    const setActiveTab = useCallback((tab: Tab) => {
        setActiveTabState(tab);
    }, []);

    return (
        <TabContext.Provider value={{
            activeTab,
            setActiveTab,
            isScrolled,
            setIsScrolled,
            isParentalModalVisible,
            setParentalModalVisible,
            isParentalUnlocked,
            setParentalUnlocked,
        }}>
            {children}
        </TabContext.Provider>
    );
};

// ── Hook ─────────────────────────────────────────────────────
export const useTab = (): TabContextValue => {
    const ctx = useContext(TabContext);
    if (!ctx) {
        throw new Error('useTab must be used within a TabContextProvider');
    }
    return ctx;
};
