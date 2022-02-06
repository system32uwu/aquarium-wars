import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import create, { State } from 'zustand'
import { buildNonceMessage } from '../util/web3'

type Wallet = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
}

interface WalletState extends State {
  instance?: Wallet
  message?: string
  connect: () => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  instance: undefined,
  message: undefined,
  connect: () => {
    set((_) => ({ message: undefined }))

    const providerOptions = {
      /* See Provider Options Section */
    }

    const web3Modal = new Web3Modal({
      cacheProvider: true, // optional
      providerOptions, // required
    })

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
          set((_) => ({ instance: { provider, signer } }))
        } else {
          set((_) => ({ message: walletResData.error }))
        }
      })
      .catch((e) => {
        set((_) => ({ instance: undefined, message: e.message }))
      })
  },
  disconnect: () => {
    set((_) => ({
      instance: undefined,
    }))
  },
}))
