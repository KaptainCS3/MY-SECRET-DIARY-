import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import DiaryList from '../types/DiaryList.type'
interface DiaryState {
  list: DiaryList[];
}
const initialState: DiaryState = {
  list: [],
};

const storedList = createSlice({
    name: 'diaryList',
    initialState,
    reducers:{
        diaryListItems:(state, action: PayloadAction<DiaryList[]>) =>{
            state.list = (action.payload);
        }
    }
})

export const {diaryListItems} = storedList.actions

export default storedList.reducer