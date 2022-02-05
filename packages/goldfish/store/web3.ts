import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import create, { State } from 'zustand'
import { getNonceMessage } from '../util/web3'

type Wallet = {
  provider: ethers.providers.Web3Provider
  signer: ethers.providers.JsonRpcSigner
}

interface WalletState extends State {
  instance?: Wallet
  connect: () => void
  disconnect: () => void
}

export const useWalletStore = create<WalletState>((set) => ({
  instance: undefined,
  connect: () => {
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
        const _signature = await provider.getSigner().signMessage(getNonceMessage())

        set((_) => ({ instance: { provider, signer } }))
      })
      .catch((e) => {
        set((_) => ({ instance: undefined }))
      })
  },
  disconnect: () => {
    set((_) => ({
      instance: undefined,
    }))
  },
}))
