import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/UserSlice';
import diaryReducer from '../features/DiarySlice'
import diaryListReducer from '../features/DiaryList';
import loadingFetchReducer from '../features/LoadingFetch';
import DeleteDiaryReducer from '../features/DeleteDiary';
import UpdateDiaryReducer from '../features/UpdateDiary';
const store = configureStore({
  reducer: {
    user: userReducer,
    diary: diaryReducer,
    diaryList: diaryListReducer,
    fetchState: loadingFetchReducer,
    diaryDelete: DeleteDiaryReducer,
    diaryUpdate: UpdateDiaryReducer
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;