import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import DiaryList from '../types/DiaryList.type'
// import { collection, doc, updateDoc, serverTimestamp } from "firebase/firestore";
// import {toast} from 'react-toastify'
// import { db } from "../utils/firebase";
// import { useAppDispatch } from '../hooks/hook';

// const dispatch = useAppDispatch()


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
// export const updateList = async (entryId: string, el: DiaryList) => {
//     let resultUpdate: DiaryList[] = [];
//     if (el.id === entryId) {
//       resultUpdate = [el];
//     }
//     try {
//       // setDiaryUpdate(true);
//       await updateDoc(doc(diaryRef, entryId), {
//         ...el,
//         isPublic: !formik.values.isPublic_edit,
//         updatedAt: serverTimestamp(),
//       });
//       dispatch(UpdateDiaryElement(resultUpdate));
//       setDiaryUpdate(false);
//       toast.success("diary entry updated successfully");
//     } catch (error) {
//       console.log("Error deleting document: ", error);
//       toast.error("Error updating diary entry");
//     }
//   };

