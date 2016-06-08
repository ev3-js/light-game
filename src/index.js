import {initApp, activateLight, deactivateLight} from './actions'
import {middleware, subscribe, unSubscribe, set} from './firebaseMW'
import {createStore, applyMiddleware} from 'redux'
import Emitter from 'component-emitter'
import firebase from 'firebase'
import reducer from './reducer'
import config from '../config'
import flo from 'redux-flo'
import Rx from 'rx-lite'
import logger from 'redux-logger'

let getActive

const defaultOpts = {
  active: [1, 2, 3, 4]
}

const presses = { 1: 0, 2: 0, 3: 0, 4: 0 }
const buttonPress = new Emitter()
const source = Rx.Observable.fromEvent(
  buttonPress,
  'press'
)

function* initialize (deviceRef, active) {
  yield initApp(deviceRef, {presses, active})
  yield subscribe({ref: `${deviceRef}/presses`, listener: 'child_changed', cb: function (snap) {
    buttonPress.emit('press', snap.key)
  }})
}

function game (deviceRef, opts) {
  opts = {...defaultOpts, ...opts}
  let store = createStore(reducer, opts, applyMiddleware(flo(), middleware(config), logger()))
  let {dispatch, getState} = store
  let {points} = opts

  dispatch(initialize(deviceRef, opts.active))
  getActive = function () {
    return getState().active
  }
  return dispatch
}

export {
  activateLight,
  deactivateLight,
  getActive,
  source,
  set
}

export default game
