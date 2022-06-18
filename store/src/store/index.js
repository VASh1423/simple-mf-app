import { configureStore } from '@reduxjs/toolkit'

export const configureStore({
  reducer: counterSlice.reducer
})

import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: state => {
      state.value += 1
    },
    decrement: state => {
      state.value -= 1
    },
  }
})

export const { increment, decrement } = counterSlice.actions