let currentPayload = null

function setCurrentResultPayload(payload) {
  currentPayload = payload
}

function getCurrentResultPayload() {
  return currentPayload
}

module.exports = {
  setCurrentResultPayload,
  getCurrentResultPayload,
}
