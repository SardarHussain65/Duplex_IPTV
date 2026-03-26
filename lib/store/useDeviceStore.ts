import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface DeviceState {
  id: string | null;
  hasUsedTrial: boolean;
  isTrial: boolean;
  isBlocked: boolean;
  subscription: {
    startDate: string | null;
    endDate: string | null;
    status: string | null;
    expired?: boolean;
    canceled?: boolean;
  } | null;
  activePlaylistId: string | null;
  setDeviceData: (data: {
    id: string;
    hasUsedTrial: boolean;
    isTrial: boolean;
    isBlocked?: boolean;
    subscription: DeviceState['subscription'];
  }) => void;
  setActivePlaylistId: (id: string | null) => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      id: null,
      hasUsedTrial: false,
      isTrial: false,
      isBlocked: false,
      subscription: null,
      activePlaylistId: null,
      setDeviceData: (data) => set(data),
      setActivePlaylistId: (id) => set({ activePlaylistId: id }),
    }),
    {
      name: 'device-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        const { activePlaylistId, ...rest } = state;
        return rest;
      },
    }
  )
);
