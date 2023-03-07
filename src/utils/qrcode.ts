import qrcode from 'qrcode'

export async function generateQrCode(qrCode: string): Promise<Buffer> {
  const dataUrl = await qrcode.toDataURL(qrCode, {
    type: 'image/png',
    scale: 10,
    errorCorrectionLevel: 'M',
  })
  const matches = dataUrl.match(/^data:image\/png;base64,(.+)$/)
  let base64Data = ''
  if (matches) {
    base64Data = matches[1]!
  }
  return Buffer.from(base64Data, 'utf8')
}
