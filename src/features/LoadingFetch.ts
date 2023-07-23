import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface fetchState{
    loading: boolean;
}
const initialState:fetchState = {
    loading: true
}

const LoadingFetch = createSlice({
    name: 'fetchState',
    initialState,
    reducers:{
        fetchRequest:(state, action: PayloadAction<fetchState>) =>{
            state.loading = (action.payload.loading);
        },
    },
})

export const{fetchRequest} = LoadingFetch.actions
export default LoadingFetch.reducer;