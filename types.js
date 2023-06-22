/**
 * @typedef {Object} ViewState
 * @property {number} scale
 * @property {number} centerRe
 * @property {number} centerIm
 * @property {number} maxIterations
 */

/**
 * @typedef {Object} ViewPortSize
 * @property {number} width
 * @property {number} height
 * @property {number} upscale
 */

/**
 * @typedef {Object} MouseState
 * @property {number} initialX
 * @property {number} initialY
 * @property {unknown} initialState
 */

/**
 * @typedef {Object} ConversionFunctions
 * @property {(x: number) => number} screenToRe
 * @property {(y: number) => number} screenToIm
 */

/**
 * @typedef {(number | null)[][]} MandelbrotValues
 */
