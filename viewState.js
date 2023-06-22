import {getConversionFunctions} from './calculate.js'

/**
 * @returns {ViewState}
 */
export function getInitialState(height) {
  return {
    scale: 2 / height,
    centerRe: 0.5,
    centerIm: 0,
    maxIterations: 100
  }
}

/**
 * @param {Object} props
 * @property {ViewState} state
 * @property {number} diffX
 * @property {number} diffY
 * @returns {ViewState}
 */
export function move({ state, diffX, diffY }) {
  return {
    ...state,
    centerRe: state.centerRe + diffX * state.scale,
    centerIm: state.centerIm + diffY * state.scale,
  }
}

/**
 * @param {Object} props
 * @property {ViewState} state
 * @property {ViewPortSize} size
 * @property {number} factor
 * @property {number} x
 * @property {number} y
 * @returns {ViewState}
 */
export function zoom({ state, size, factor, x, y }) {
  const newScale = state.scale * factor

  const before = getConversionFunctions(state, size)
  const after = getConversionFunctions({ ...state, scale: newScale }, size)

  return {
    ...state,
    centerRe: state.centerRe + (after.screenToRe(x) - before.screenToRe(x)),
    centerIm: state.centerIm + (after.screenToIm(y) - before.screenToIm(y)),
    scale: newScale
  }
}
