export const CDOE = Object.freeze({
  HTTP_CODE: {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_BUSY: 503,
  },
  CUSTOM_CODE: {
    SOME_CUSTOM_ERROR: 1001,
  },
})

export const MSG = Object.freeze({
  0: 'success',
  400: 'invalid param',
  401: 'unauthorized',
  403: 'forbidden',
  404: 'not found',
  500: 'internal server error',
  503: 'service busy',
  1001: 'some custom error msg',
})

export const WEIXINOFFICIAL = [
  '朋友推荐消息',
  '微信支付',
  '微信运动',
  '微信团队',
  '文件传输助手',
  'QQ邮箱提醒',
  'recommendation message',
]

export enum MessageType {
  Unknown = 0,
  Attachment = 1, // Attach(6),
  Audio = 2, // Audio(1), Voice(34)
  Contact = 3, // ShareCard(42)
  ChatHistory = 4, // ChatHistory(19)
  Emoticon = 5, // Sticker: Emoticon(15), Emoticon(47)
  Image = 6, // Img(2), Image(3)
  Text = 7, // Text(1)
  Location = 8, // Location(48)
  MiniProgram = 9, // MiniProgram(33)
  GroupNote = 10, // GroupNote(53)
  Transfer = 11, // Transfers(2000)
  RedEnvelope = 12, // RedEnvelopes(2001)
  Recalled = 13, // Recalled(10002)
  Url = 14, // Url(5)
  Video = 15, // Video(4), Video(43)
  Post = 16, // Moment, Channel, Tweet, etc
}
