// import {createSlice, PayloadAction} from '@reduxjs/toolkit'
// import { collection, doc, deleteDoc } from "firebase/firestore";
// import {toast} from 'react-toastify'
// import { db } from "../utils/firebase";
// import { useAppDispatch } from '../hooks/hook';
// // import { AppDispatch } from '../app/store';

// interface DiaryList {
//   id: string;
//   image: string;
//   category: string;
//   description: string;
//   isPublic: boolean;
//   createdDate: Date;
//   userID: string
//   // formattedDate: string;
//   // formattedTime: string;
// }
// interface DiaryDelete {
//     diaryDelete: boolean;
//     diaryDeleteList: DiaryList[];
// }
// const initialState:DiaryDelete = {
//     diaryDelete: false,
//     diaryDeleteList: []
// }
// const DeleteDiary = createSlice({
//     name: 'diaryDelete',
//         initialState,
//         reducers:{
//         setDiaryDelete: (state, action: PayloadAction<boolean>) => {
//              state.diaryDelete = action.payload;
//          },
//          DeleteDiaryElement:(state, action:PayloadAction<DiaryList[]>) =>{
//         state.diaryDeleteList = action.payload
//     }
// }
// })

// export const { setDiaryDelete, DeleteDiaryElement } = DeleteDiary.actions;
// export default DeleteDiary.reducer

// const diaryRef = collection(db, "diary");
// const dispatch = useAppDispatch();
// export const  deleteDiaryEntry = async (entryId: string) => {
//     try {
//       dispatch(setDiaryDelete(true))
//       await deleteDoc(doc(diaryRef, entryId));
//       console.log(`Document with ID ${entryId} deleted successfully`);
//       dispatch(setDiaryDelete(false));
//       toast.success("diary entry deleted successfully");
//     } catch (error) {
//       console.log("Error deleting document: ", error);
//       toast.error("Error deleting diary entry");
//     }
//   };