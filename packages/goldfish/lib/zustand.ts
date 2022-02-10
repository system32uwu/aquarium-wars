import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import create, { State } from 'zustand'
import { buildNonceMessage } from '../util/web3'
import { PublicUser } from './types'

const providerOptions = {
  /* See Provider Options Section */
}

type Wallet = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
}

interface WalletState extends State {
  instance?: Wallet
  message?: string
  user?: PublicUser
  setUsername: (username: string) => Promise<void>
  connect: (silent: boolean) => Promise<void>
  disconnect: () => Promise<void>
}

export const useWalletStore = create<WalletState>((set) => ({
  instance: undefined,
  message: undefined,
  user: undefined,
  setUsername: async (username: string) => {
    await fetch('/api/auth/update-username', {
      method: 'POST',
      body: JSON.stringify({
        username: username,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    set((s) => ({ user: { ...s.user, username } }))
  },
  connect: async (silent = false) => {
    set((_) => ({ message: undefined, instance: undefined, user: undefined }))

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    })

    // check if user is already logged in (address stored in cookie)
    const meRes = await fetch('/api/auth/me')
    const me = await meRes.json()

    if (me.user) {
      // if user was already logged in just connect without making them sign the message
      const instance = await web3Modal.connect()

      const provider = new ethers.providers.Web3Provider(instance)
      const signer = provider.getSigner()

      set((_) => ({ user: me.user, instance: { provider, signer } }))
    } else if (!silent) {
      // if they weren't logged in send the nonce challenge to verify identity
      web3Modal
        .connect()
        .then(async (instance) => {
          const provider = new ethers.providers.Web3Provider(instance)
          const signer = provider.getSigner()

          const _address = await provider.getSigner().getAddress()

          const nonceRes = await fetch('/api/auth/nonce', {
            method: 'POST',
            body: JSON.stringify({ address: _address }),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const { nonce } = await nonceRes.json()

          const _signature = await provider.getSigner().signMessage(buildNonceMessage(nonce))

          const walletRes = await fetch('/api/auth/wallet', {
            method: 'POST',
            body: JSON.stringify({ address: _address, nonce: nonce, signature: _signature }),
            headers: {
              'Content-Type': 'application/json',
            },
          })

          const walletResData = await walletRes.json()

          if (walletRes.status === 200) {
            set((_) => ({ instance: { provider, signer }, user: walletResData.user }))
          } else {
            set((_) => ({ message: walletResData.error }))
          }
        })
        .catch((e) => {
          set((_) => ({ instance: undefined, user: undefined, message: e.message }))
        })
    }
  },
  disconnect: async () => {
    await fetch('/api/auth/logout')
    set((_) => ({
      instance: undefined,
      user: undefined,
    }))
  },
}))
