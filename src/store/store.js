import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import countCartItemsReducer from './countCartItemsSlide';
import themeReducer from './themeSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        countCartItems: countCartItemsReducer,
        theme: themeReducer
    },
})