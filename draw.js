/**
 * @param {HTMLCanvasElement} canvas
 * @param {MandelbrotValues} values
 * @param {ViewState} state
 */
export function draw(canvas, values, state) {
  console.log('draw')

  console.time('draw')

  const ctx = canvas.getContext('2d')

  const width = values.length
  const height = values[0]?.length || 0

  ctx.canvas.width = width
  ctx.canvas.height = height
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, width, height)

  // TODO: find a nice color palette (or allow selecting different palettes)

  function getColorA(n) {
    return `hsl(14, 100%, ${state.maxIterations - (state.maxIterations * n / state.maxIterations)}%)`
  }

  function getColorB(n) {
    const hue = 360 * n / state.maxIterations
    return `hsl(${hue}, 100%, 50%)`
  }

  function getColorC(n) {
    const hue = n > 0 ? (360 * Math.log(n) / Math.log(state.maxIterations)) : 0
    return `hsl(${hue}, 100%, 50%)`
  }

  function getColorD(n) {
    const hue = 120 - (n > 0 ? (120 * Math.log(n) / Math.log(state.maxIterations)) : 0)
    return `hsl(${hue}, 100%, 50%)`
  }

  const colors = new Array(state.maxIterations).fill(0).map((_, n) => getColorD(n))

  console.log('draw', { colors })

  for (let x = 0; x < values.length; x++) {
    const valuesX = values[x]

    let y = 0
    do {
      const n = valuesX[y]

      if (n !== null) {
        let count = 0
        while (valuesX[y + count] === n) {
          count++
        }

        // TODO: adjust the color range to be between the min and max m, instead of 0-MAX_ITERATIONS?
        ctx.fillStyle = colors[n]
        ctx.fillRect(x, y, 1, count)
        y += count
      } else {
        y++
      }
    } while(y < height)
  }

  console.timeEnd('draw')
}
