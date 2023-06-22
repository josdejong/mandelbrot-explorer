/**
 * @param {HTMLCanvasElement} canvas
 * @returns {Promise<void>}
 */
export async function downloadImage(canvas) {
  const downloadLink = document.createElement('a')
  downloadLink.href = canvas.toDataURL('image/png')
  downloadLink.download = `mandelbrot_${new Date().toISOString()}.png`
  downloadLink.click()
}
