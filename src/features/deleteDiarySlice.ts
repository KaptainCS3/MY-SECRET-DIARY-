import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import DiaryList from '../types/DiaryList.type';

interface DiaryDelete {
  diaryDeleteList: DiaryList[];
}

const initialState: DiaryDelete = {
  diaryDeleteList: [],
};

export const deleteDiarySlice = createSlice({
  name: 'diaryDelete',
  initialState,
  reducers: {
    addDiaryToDeleteList: (state, action: PayloadAction<DiaryList>) => {
      state.diaryDeleteList.push(action.payload);
    },
    removeDiaryFromDeleteList: (state, action: PayloadAction<string>) => {
      state.diaryDeleteList = state.diaryDeleteList.filter((item) => item.id !== action.payload);
    },
    clearDiaryDeleteList: (state) => {
      state.diaryDeleteList = [];
    },
  },
});

export const { addDiaryToDeleteList, removeDiaryFromDeleteList, clearDiaryDeleteList } = deleteDiarySlice.actions;

export default deleteDiarySlice.reducer;