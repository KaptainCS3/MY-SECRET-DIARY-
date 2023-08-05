import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface DiaryEntry {
  id: string;
  image: string | null;
  category: string;
  description: string;
  isPublic: boolean;
  createdAt: Date | null | object;
  updatedAt: Date | null | object;
}
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