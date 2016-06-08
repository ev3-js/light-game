import {addLight, removeLight} from './actions'

export default (state, action) => {
  switch (action.type) {
    case addLight.type:
      return {
        ...state,
        active: action.payload
      }
    case removeLight.type:
      return {
        ...state,
        active: action.payload
      }
  }
  return state
}
