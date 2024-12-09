import {createSlice} from "@reduxjs/toolkit"

//defining initial state before create=ing slice
const initialState={
    //signup data ,loading after lec-4
    signupData: null,
    loading: false,
    //local storage not necessary but have used it
    token: localStorage.getItem("token")?JSON.parse(localStorage.getItem("token")):null,
}

const authSlice=createSlice({
    name:"auth",
    initialState: initialState,
    reducers:{
        setSignupData(state, value) {
            state.signupData = value.payload;
          },
        setLoading(state, value) {
            state.loading = value.payload;
          },
        setToken(state,value){
            state.token=value.payload;
        },
    },
});

export const { setSignupData, setLoading, setToken } = authSlice.actions;
export default authSlice.reducer;
