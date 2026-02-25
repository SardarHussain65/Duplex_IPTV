/**
 * ─────────────────────────────────────────────────────────────
 *  DUPLEX IPTV — App Context
 *  Shared state for:
 *  - isScrolled: whether the content has scrolled past the hero
 *    (used to show/hide the nav bar's backdrop blur)
 *  - Parental control unlock state
 * ─────────────────────────────────────────────────────────────
 */

import React, { createContext, useContext, useState } from 'react';

// ── Context shape ────────────────────────────────────────────
interface TabContextValue {
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [isParentalModalVisible, setParentalModalVisible] = useState(false);
    const [isParentalUnlocked, setParentalUnlocked] = useState(false);

    return (
        <TabContext.Provider value={{
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
