import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface DiaryList {
  id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  userID: string
  // formattedDate: string;
  // formattedTime: string;
}
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