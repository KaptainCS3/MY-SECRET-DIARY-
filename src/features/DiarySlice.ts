import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DiaryEntry from '../types/DiaryState.type';
interface DiaryState {
  entries: DiaryEntry[];
}
const initialState: DiaryState = {
  entries: [],
};
const diarySlice = createSlice({
  name: "diary",
  initialState,
  reducers: {
    addDiaryEntry: (state, action: PayloadAction<DiaryEntry[]>) => {
      state.entries = (action.payload);
    },
  },
});

export const { addDiaryEntry } = diarySlice.actions;

export default diarySlice.reducer;