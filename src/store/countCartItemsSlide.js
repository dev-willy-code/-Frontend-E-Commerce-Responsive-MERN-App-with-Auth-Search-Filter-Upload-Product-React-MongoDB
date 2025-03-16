import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    count: 0,
}

export const countCartItemsSlide = createSlice({
    name: 'countcartItems',
    initialState,
    reducers: {
        setCountCartItems: (state, action) => {
            state.count = action.payload;
            console.log("funciona bien setCountCartItems(redux)");
        }
    }
})

export const { setCountCartItems } = countCartItemsSlide.actions

export default countCartItemsSlide.reducer
