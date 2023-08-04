import {createSlice, PayloadAction} from '@reduxjs/toolkit'
// import { collection, doc, deleteDoc } from "firebase/firestore";
// import {toast} from 'react-toastify'
// import { db } from "../utils/firebase";
// import { AppDispatch } from '../app/store';
// import { useAppDispatch } from '../hooks/hook';

// const dispatch = useAppDispatch()

interface DiaryList {
  id: string;
  image: string;
  category: string;
  description: string;
  isPublic: boolean;
  createdAt: Date;
  userID: string
}
interface DiaryUpdate {
  diaryUpdate: boolean;
  diaryUpdateList: DiaryList[];
}
const initialState:DiaryUpdate = {
    diaryUpdate: false,
    diaryUpdateList: []
}
const UpdateDiary = createSlice({
    name: 'diaryUpdate',
        initialState,
        reducers:{
        setDiaryUpdate: (state, action: PayloadAction<boolean>) => {
      state.diaryUpdate = action.payload;
    },
        UpdateDiaryElement: (state, action: PayloadAction<DiaryList[]>) => {
      state.diaryUpdateList = action.payload;
    },
}
})

export const { setDiaryUpdate, UpdateDiaryElement } = UpdateDiary.actions;
export default UpdateDiary.reducer

// const diaryRef = collection(db, "diary");
//  export const  updateDiaryEntry = async (entryId: string) => {
//     try {
//       dispatch(setDiaryUpdate(true))
//       await deleteDoc(doc(diaryRef, entryId));
//       console.log(`Document with ID ${entryId} deleted successfully`);
//       dispatch(setDiaryUpdate(false));
//       toast.success("diary entry deleted successfully");
//     } catch (error) {
//       console.log("Error deleting document: ", error);
//       toast.error("Error deleting diary entry");
//     }
//   };

//   const updateList = async (entryId: string) => {
    // try {
    //   setDiaryUpdate(true);
    //   await updateDoc(doc(diaryRef, entryId), {
    //     ...el,
    //     isPublic: !formik.values.isPublic_edit,
    //     createdDate: serverTimestamp(),
    //   });
    //   setDiaryUpdate(false);
    //   toast.success("diary entry updated successfully");
    // } catch (error) {
    //   console.log("Error deleting document: ", error);
    //   toast.error("Error updating diary entry");
    // }
//   };