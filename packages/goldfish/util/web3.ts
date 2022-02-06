export const NONCE_MESSAGE = 'Please prove you control this wallet by signing this random text: '

export const nonce = () => Math.floor(Math.random() * 1000000).toString()

export const buildNonceMessage = (_nonce: string) => NONCE_MESSAGE + _nonce
