import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import DiaryList from '../types/DiaryList.type'
// import { deleteDoc, doc, collection } from 'firebase/firestore';
// import { db } from '../utils/firebase';
// import { useAppDispatch } from '../hooks/hook';
// import {toast} from 'react-toastify'



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



// export const deleteList = async (entryId: string, el: DiaryList) => {
//     const dispatch = useAppDispatch()
//     const diaryRef = collection(db, 'diary')
//     let result: DiaryList[] = [];
//     if (el.id === entryId) {
//       result = [el];
//     }
//     try {
//       setDiaryDelete(true);
//       await deleteDoc(doc(diaryRef, entryId));
//       dispatch(DeleteDiaryElement(result));
//       console.log(`Document with ID ${entryId} deleted successfully`);
//     setDiaryDelete(false);
//       toast.success("diary entry deleted successfully");
//     } catch (error) {
//       console.log("Error deleting document: ", error);
//       toast.error("Error deleting diary entry");
//     }
//   };