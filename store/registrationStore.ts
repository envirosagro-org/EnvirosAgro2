import { create } from 'zustand';
export interface RegistrationState {
  step: number;
  data: {
    name?: string;
    email?: string;
    password?: string;
    farmName?: string;
    farmSize?: string;
    mainCrop?: string;
    location?: string;
  };
}

interface RegistrationStore {
  registrationState: RegistrationState | null;
  setRegistrationState: (state: RegistrationState | null) => void;
  updateRegistrationData: (data: Partial<RegistrationState['data']>) => void;
  nextRegistrationStep: () => void;
  prevRegistrationStep: () => void;

  vendorRegistrationState: any | null;
  setVendorRegistrationState: (state: any | null) => void;

  handshakeRegistrationState: any | null;
  setHandshakeRegistrationState: (state: any | null) => void;

  missionRegistrationState: any | null;
  setMissionRegistrationState: (state: any | null) => void;

  liveFarmingRegistrationState: any | null;
  setLiveFarmingRegistrationState: (state: any | null) => void;
}

export const useRegistrationStore = create<RegistrationStore>((set) => ({
  registrationState: null,
  setRegistrationState: (state) => set({ registrationState: state }),
  updateRegistrationData: (data) => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      data: { ...state.registrationState.data, ...data }
    } : { step: 1, data }
  })),
  nextRegistrationStep: () => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      step: state.registrationState.step + 1
    } : null
  })),
  prevRegistrationStep: () => set((state) => ({
    registrationState: state.registrationState ? {
      ...state.registrationState,
      step: Math.max(1, state.registrationState.step - 1)
    } : null
  })),

  vendorRegistrationState: null,
  setVendorRegistrationState: (state) => set({ vendorRegistrationState: state }),

  handshakeRegistrationState: null,
  setHandshakeRegistrationState: (state) => set({ handshakeRegistrationState: state }),

  missionRegistrationState: null,
  setMissionRegistrationState: (state) => set({ missionRegistrationState: state }),

  liveFarmingRegistrationState: null,
  setLiveFarmingRegistrationState: (state) => set({ liveFarmingRegistrationState: state }),
}));
