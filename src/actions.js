import createAction from '@f/create-action'
import {set} from './firebaseMW'

const addLight = createAction('lightGame/ACTIVATE_LIGHT')
const removeLight = createAction('lightGame/DEACTIVATE_LIGHT')

let deviceRef

function deactivateLight (active, port) {
  active = active.filter((num) => num != port)
  return [
    updateActive(active),
    removeLight(active)
  ]
}

function activateLight (active, port) {
  if (active.indexOf(port) === -1) {
    active.push(port)
  }
  return [
    addLight(active),
    updateActive(active)
  ]
}

function updateActive (active) {
  return set({ref: `${deviceRef}/active`, value: active})
}

function initApp (dRef, {presses, active}) {
  deviceRef = dRef
  return [
    set({ref: `${deviceRef}/active`, value: active}),
    set({ref: `${deviceRef}/presses`, value: presses})
  ]
}

export {
  activateLight,
  removeLight,
  deactivateLight,
  addLight,
  initApp
}
