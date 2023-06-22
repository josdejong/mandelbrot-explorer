const MAX_DISTANCE = 2

/**
 * @param {ViewState} state
 * @param {ViewPortSize} size
 * @returns {ConversionFunctions}
 */
export function getConversionFunctions({ scale, centerRe, centerIm}, { width, height, upscale}) {
  const effectiveScale = scale * upscale
  const xOffset = (width /2) * effectiveScale
  const yOffset = (height/2) * effectiveScale
  const screenToRe = (x) => x * effectiveScale - xOffset - centerRe
  const screenToIm = (y) => y * effectiveScale - yOffset - centerIm

  return { screenToRe, screenToIm }
}

/**
 * @param {ViewState} state
 * @param {ViewPortSize} size
 * @returns {MandelbrotValues} A 2d array containing values null when inside the mandelbrot set,
 *                                and a number with the number of iterations when outside the set.
 */
export function calculateMandelbrotValues(state, size) {
  console.log('calculate', state, size)
  console.time('calculate')
  const { screenToRe, screenToIm } = getConversionFunctions(state, size)

  const values = new Array(size.width).fill(0).map((_, x) => {
    const cRe = screenToRe(x)

    return new Array(size.height).fill(0).map((_, y) => {
      const cIm = screenToIm(y)

      return mandelbrot(cRe, cIm, state.maxIterations)
    })
  })
  console.timeEnd('calculate')

  return values
}

/**
 * based upon: https://dev.to/foqc/mandelbrot-set-in-js-480o
 * @param {number} cRe
 * @param {number} cIm
 * @param {number} maxIterations
 * @returns {null|number}
 */
export function mandelbrot(cRe, cIm, maxIterations) {
  let zRe = 0
  let zIm = 0
  let n = 0
  let d = 0

  do {
    const zRe2 = zRe * zRe
    const zIm2 = zIm * zIm
    const pRe = zRe2 - zIm2
    const pIm = 2 * zRe * zIm
    zRe = pRe + cRe
    zIm = pIm + cIm
    d = Math.sqrt(zRe2 + zIm2)
    n += 1
  } while (d <= MAX_DISTANCE && n < maxIterations)

  // https://stackoverflow.com/a/1243788/1262753
  // nsmooth := n + 1 - Math.log(Math.log(zn.abs()))/Math.log(2)

  return d <= MAX_DISTANCE ? null : n
}
