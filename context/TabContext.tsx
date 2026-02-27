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
    isParentalControlEnabled: boolean;
    setIsParentalControlEnabled: (enabled: boolean) => void;
    parentalPin: string;
    setParentalPin: (pin: string) => void;
    isAutoplayEnabled: boolean;
    setIsAutoplayEnabled: (enabled: boolean) => void;
    searchBarNode: number | null;
    setSearchBarNode: (node: number | null) => void;
    settingsTabNode: number | null;
    setSettingsTabNode: (node: number | null) => void;
    settingsSidebarNode: number | null;
    setSettingsSidebarNode: (node: number | null) => void;
    settingsContentNode: number | null;
    setSettingsContentNode: (node: number | null) => void;
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
    const [isParentalControlEnabled, setIsParentalControlEnabled] = useState(false);
    const [parentalPin, setParentalPin] = useState('0000');
    const [isAutoplayEnabled, setIsAutoplayEnabled] = useState(false);
    const [searchBarNode, setSearchBarNode] = useState<number | null>(null);
    const [settingsTabNode, setSettingsTabNode] = useState<number | null>(null);
    const [settingsSidebarNode, setSettingsSidebarNode] = useState<number | null>(null);
    const [settingsContentNode, setSettingsContentNode] = useState<number | null>(null);

    return (
        <TabContext.Provider value={{
            isScrolled,
            setIsScrolled,
            isParentalModalVisible,
            setParentalModalVisible,
            isParentalUnlocked,
            setParentalUnlocked,
            isParentalControlEnabled,
            setIsParentalControlEnabled,
            parentalPin,
            setParentalPin,
            isAutoplayEnabled,
            setIsAutoplayEnabled,
            searchBarNode,
            setSearchBarNode,
            settingsTabNode,
            setSettingsTabNode,
            settingsSidebarNode,
            setSettingsSidebarNode,
            settingsContentNode,
            setSettingsContentNode,
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
