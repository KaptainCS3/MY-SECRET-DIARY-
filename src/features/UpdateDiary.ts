import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import { collection, doc, deleteDoc } from "firebase/firestore";
import {toast} from 'react-toastify'
import { db } from "../utils/firebase";
// import { AppDispatch } from '../app/store';
import { useAppDispatch } from '../hooks/hook';

const dispatch = useAppDispatch();
interface DiaryDelete {
  diaryUpdate: boolean;
}
const initialState:DiaryDelete = {
    diaryUpdate: false
}
const UpdateDiary = createSlice({
    name: 'diaryDelete',
        initialState,
        reducers:{
        setDiaryUpdate: (state, action: PayloadAction<boolean>) => {
      state.diaryUpdate = action.payload;
    },
}
})

export const { setDiaryUpdate } = UpdateDiary.actions;
export default UpdateDiary.reducer

const diaryRef = collection(db, "diary");
 export const  updateDiaryEntry = async (entryId: string) => {
    try {
      dispatch(setDiaryUpdate(true))
      await deleteDoc(doc(diaryRef, entryId));
      console.log(`Document with ID ${entryId} deleted successfully`);
      dispatch(setDiaryUpdate(false));
      toast.success("diary entry deleted successfully");
    } catch (error) {
      console.log("Error deleting document: ", error);
      toast.error("Error deleting diary entry");
    }
  };

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