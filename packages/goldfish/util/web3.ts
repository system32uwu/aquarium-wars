const NONCE_MESSAGE = 'Please prove you control this wallet by signing this random text: '

const nonce = () => Math.floor(Math.random() * 1000000).toString()

export const getNonceMessage = () => NONCE_MESSAGE + nonce()
