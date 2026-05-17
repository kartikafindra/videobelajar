// Action Types
export const SET_API_DATA = 'SET_API_DATA'

// Action Creator
export const setApiData = (data) => ({
  type: SET_API_DATA,
  payload: data,
})

// Initial State
const initialState = {
  data: [],
}

// Reducer
function apiReducer(state = initialState, action) {
  switch (action.type) {
    case SET_API_DATA:
      return {
        ...state,
        data: action.payload,
      }
    default:
      return state
  }
}

export default apiReducer
