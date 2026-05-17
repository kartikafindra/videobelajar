import { createSlice } from '@reduxjs/toolkit'

const notesSlice = createSlice({
  name: 'notes',
  initialState: {
    items: [],
  },
  reducers: {
    addNote(state, action) {
      state.items.unshift(action.payload)
    },
    updateNote(state, action) {
      const { id, text } = action.payload
      const note = state.items.find((n) => n.id === id)
      if (note) note.text = text
    },
    deleteNote(state, action) {
      state.items = state.items.filter((n) => n.id !== action.payload)
    },
  },
})

export const { addNote, updateNote, deleteNote } = notesSlice.actions
export default notesSlice.reducer
