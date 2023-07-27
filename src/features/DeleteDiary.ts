import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface DiaryList {
  id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdDate: Date;
  userID: string
}
interface DiaryDelete {
    diaryDelete: boolean;
    diaryDeleteList: DiaryList[];
}
const initialState:DiaryDelete = {
    diaryDelete: false,
    diaryDeleteList: []
}
const DeleteDiary = createSlice({
    name: 'diaryDelete',
        initialState,
        reducers:{
        setDiaryDelete: (state, action: PayloadAction<boolean>) => {
             state.diaryDelete = action.payload;
         },
         DeleteDiaryElement:(state, action:PayloadAction<DiaryList[]>) =>{
        state.diaryDeleteList = action.payload
    }
}
})

export const { setDiaryDelete, DeleteDiaryElement } = DeleteDiary.actions;
export default DeleteDiary.reducer