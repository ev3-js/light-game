import {initApp, activateLight, deactivateLight} from './actions'
import {middleware, subscribe, set, unSubscribe} from './firebaseMW'
import {createStore, applyMiddleware} from 'redux'
import Emitter from 'component-emitter'
import reducer from './reducer'
import config from '../config'
import flo from 'redux-flo'
import Rx from 'rx-lite'

const defaultOpts = {
  active: [1, 2, 3, 4]
}

const presses = { 1: 0, 2: 0, 3: 0, 4: 0 }
const buttonPress = new Emitter()
const source = Rx.Observable.fromEvent(
  buttonPress,
  'press'
)

function * initialize (deviceRef, active) {
  yield initApp(deviceRef, {presses, active})
  yield unSubscribe({ref: `${deviceRef}/presses`})
  yield subscribe({ref: `${deviceRef}/presses`, listener: 'child_changed', cb: function (snap) {
    buttonPress.emit('press', snap.key)
  }})
}

function game (deviceRef, opts) {
  opts = {...defaultOpts, ...opts}
  let store = createStore(reducer, opts, applyMiddleware(flo(), middleware(config)))
  let {dispatch, getState} = store

  dispatch(initialize(deviceRef, opts.active))

  return {
    getActive: () => getState().active,
    runner: dispatch
  }
}

export {
  activateLight,
  deactivateLight,
  source,
  set
}

export default game
