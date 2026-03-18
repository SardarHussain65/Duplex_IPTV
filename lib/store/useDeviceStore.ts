import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DeviceState {
  id: string | null;
  hasUsedTrial: boolean;
  isTrial: boolean;
  subscription: {
    startDate: string | null;
    endDate: string | null;
    status: string | null;
  } | null;
  setDeviceData: (data: { 
    id: string; 
    hasUsedTrial: boolean; 
    isTrial: boolean;
    subscription: DeviceState['subscription'];
  }) => void;
}

export const useDeviceStore = create<DeviceState>()(
  persist(
    (set) => ({
      id: null,
      hasUsedTrial: false,
      isTrial: false,
      subscription: null,
      setDeviceData: (data) => set(data),
    }),
    {
      name: 'device-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
