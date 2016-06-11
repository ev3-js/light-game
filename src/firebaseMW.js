import firebase from 'firebase'
import createAction from '@f/create-action'

const subscribe = createAction('lightGame/firebaseSub')
const unSubscribe = createAction('lightGame/firebaseUnsub')
const set = createAction('lightGame/firebaseSet')

let watched = []

function middleware (config) {
  try {
    firebase.initializeApp(config)
  } catch (e) {
    console.warn(e)
  }

  let db = firebase.database()

  return ({dispatch, getState}) => (next) => (action) => {
    switch (action.type) {
      case subscribe.type:
        let {listener = 'value'} = action.payload
        if (watched.indexOf(action.payload.ref) === -1) {
          watched.push(action.payload.ref)
          db.ref(action.payload.ref).on(listener, action.payload.cb)
        }
        break
      case unSubscribe.type:
        db.ref(action.payload.ref).off('value')
        break
      case set.type:
        let {ref, method = 'set', value} = action.payload
        db.ref(ref)[method](value)
        break
    }
    return next(action)
  }
}

export {
  middleware,
  subscribe,
  unSubscribe,
  set
}
