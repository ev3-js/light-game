var firebase = require('firebase')
var config = require('./config')

firebase.initializeApp(config)

const defaultOpts = {
  active: [1, 2, 3, 4],
  points: {1: 10, 2: 20, 3: 30, 4: 40}
}

function initGame (deviceRef, gameRef, opts = defaultOpts) {
  let {active, points} = opts
  var db = firebase.database()

  db.ref(`${deviceRef}/active`).set(active)
  db.ref(`${deviceRef}/presses`).set({ 1: 0, 2: 0, 3: 0, 4: 0 })
  db.ref(`${deviceRef}/presses`).on('child_changed', (snap) => {
    var port = snap.key
    var idx = active.indexOf(port)
    var p = points[port]

    active = active.filter(function (activePort) {
      return port != activePort
    })

    db.ref(gameRef).transaction(function (curPoints) {
      return curPoints + p
    })
    db.ref(`${deviceRef}/active`).set(active)
  })

  return {
    setActive
  }

  function setActive (port) {
    if (active.indexOf(port) === -1) {
      active.push(port)
    }
    db.ref(`${deviceRef}/active`).set(active)
  }
}

var game = initGame('devices/light1', 'games/xEBe/teams/sharks/points')
setTimeout(() => game.setActive(1), 5000)

module.exports = initGame
