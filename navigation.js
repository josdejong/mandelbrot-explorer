/**
 * @param {HTMLElement} element
 * @param {({ factor: number, x: number, y; number }) => void} callback
 * @returns {() => void} Returns a function to destroy the zoom functionality
 */
export function onZoom(element, callback) {
  function handleWheel(event) {
    const percentage = Math.abs(event.deltaY) / 1000 // deltaY is normally something like 100 or -100
    const factor = event.deltaY < 0 ? (1 - percentage) : 1 / (1 - percentage)
    // const size = getSize()
    const x = event.clientX
    const y = event.clientY

    callback({ x, y, factor })

    // state = zoom({ state, size, factor, x, y })
    //
    // renderQuick()
    // renderQualityDebounced()
  }

  element.addEventListener('wheel', handleWheel)

  return function destroy () {
    element.removeEventListener('wheel', handleWheel)
  }
}

/**
 * @param {HTMLElement} element
 * @param {() => unknown} getInitialState
 * @param {({ initialState, diffX, diffY }) => void} callback
 * @returns {() => void} Returns a function to destroy the zoom functionality
 */
export function onMove(element, getInitialState, callback) {
  /** @type {MouseState | null} */
  let mouseState = null

  function handleMouseDown(event) {
    mouseState = {
      initialX: event.clientX,
      initialY: event.clientY,
      initialState: getInitialState()
    }
  }

  function handleMouseMove(event) {
    if (!mouseState) {
      return
    }

    const { initialX, initialY, initialState } = mouseState
    const diffX = event.clientX - initialX
    const diffY = event.clientY - initialY

    callback({ initialState, diffX, diffY })
  }

  function handleMouseUp() {
    mouseState = null
  }

  element.addEventListener('mousedown', handleMouseDown)
  element.addEventListener('mousemove', handleMouseMove)
  element.addEventListener('mouseup', handleMouseUp)

  return function destroy () {
    element.removeEventListener('mousedown', handleMouseDown)
    element.removeEventListener('mousemove', handleMouseMove)
    element.removeEventListener('mouseup', handleMouseUp)
  }
}
