import {calculateMandelbrotValues} from './calculate.js'
import {draw} from './draw.js'
import {debounce} from './debounce.js'
import {DEBOUNCE_DELAY_MS, QUICK_RENDER_UPSCALE} from './constants.js'
import {getInitialState, move, zoom} from './viewState.js'
import {onMove, onZoom} from './navigation.js'
import {downloadImage} from './downloadImage.js'

const canvas = document.getElementById('mandlebrot-canvas')
const reset= document.getElementById('reset')
const maxIterations= document.getElementById('max-iterations')
const save= document.getElementById('save')
const viewState = document.getElementById('view-state')

/** @type {ViewState} */
let state = getInitialState(canvas.clientHeight)

const render = (upscale = 1) => {
  const values = calculateMandelbrotValues(state, getSize(upscale))

  const zoomFactor = 2 / (state.scale * canvas.clientHeight)
  viewState.innerText = [
    `re: ${round(state.centerRe, 5)}`,
    `im: ${round(state.centerIm, 5)}`,
    `zoom: ${round(zoomFactor, 3)}`
  ].join(', ')

  maxIterations.value = String(state.maxIterations)

  draw(canvas, values, state)
}
const renderQuickDebounced = debounce(() => render(QUICK_RENDER_UPSCALE), 0)
const renderQualityDebounced = debounce(() => render(1), DEBOUNCE_DELAY_MS)

function getSize(upscale = 1) {
  const rect = canvas.getBoundingClientRect()
  return {
    width: Math.round(rect.width / upscale),
    height: Math.round(rect.height  / upscale),
    upscale
  }
}

onZoom(canvas, ({ x, y, factor }) => {
  const size = getSize()
  state = zoom({ state, size, factor, x, y })

  renderQuickDebounced()
  renderQualityDebounced()
})

onMove(canvas, () => state, ({ initialState, diffX, diffY }) => {
  state = move({ state: initialState, diffX, diffY })

  renderQuickDebounced()
  renderQualityDebounced()
})

reset.addEventListener('click', () => {
  state = getInitialState(canvas.clientHeight)
  render()
})

maxIterations.addEventListener('change', (event) => {
  const maxIterations = parseFloat(event.target.value)

  state = {
    ...state,
    maxIterations
  }

  render()
})

save.addEventListener('click', async () => {
  try {
    await downloadImage(canvas)
  } catch (err) {
    console.error(err)
  }
})

window.addEventListener('resize', () => {
  renderQuickDebounced()
  renderQualityDebounced()
})

window.addEventListener('load', () => {
  render()
})

function round(value, significantDigits) {
  return parseFloat(value.toPrecision(significantDigits))
}
