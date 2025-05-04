import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Domain } from "../../types/domain";

interface DomainState {
  domains: Domain[];
  loading: boolean;
  error: string | null;
  selectedDomain: Domain | null;
}

const initialState: DomainState = {
  domains: [],
  loading: false,
  error: null,
  selectedDomain: null,
};

const domainSlice = createSlice({
  name: "domain",
  initialState,
  reducers: {
    setDomains: (state, action: PayloadAction<Domain[]>) => {
      state.domains = action.payload;
      state.loading = false;
      state.error = null;
    },
    addDomain: (state, action: PayloadAction<Domain>) => {
      state.domains.push(action.payload);
    },
    updateDomain: (state, action: PayloadAction<Domain>) => {
      const index = state.domains.findIndex(
        (domain) => domain.id === action.payload.id
      );
      if (index !== -1) {
        state.domains[index] = action.payload;
      }
    },
    deleteDomain: (state, action: PayloadAction<string>) => {
      state.domains = state.domains.filter(
        (domain) => domain.id !== action.payload
      );
    },
    setSelectedDomain: (state, action: PayloadAction<Domain | null>) => {
      state.selectedDomain = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setDomains,
  addDomain,
  updateDomain,
  deleteDomain,
  setSelectedDomain,
  setLoading,
  setError,
} = domainSlice.actions;

export default domainSlice.reducer;
