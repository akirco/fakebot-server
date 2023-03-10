import qrcode from 'qrcode'

export async function generateQrCode(qrCode: string) {
  return await qrcode.toDataURL(qrCode, {
    type: 'image/png',
    scale: 10,
    errorCorrectionLevel: 'M',
  })
}
