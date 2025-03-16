import { createSlice } from '@reduxjs/toolkit' // this is for creating a slice of the store , this meeans  that
// we can have multiple slices of the store and each slice can have its own reducer and actions

const initialState = {
    theme: 'light',
};

const themeSlice = createSlice({
    name: 'theme', // this is the name of the slice
    initialState, // this is the initial state of the slice
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
        },
    },
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer; // this is the reducer of the slice