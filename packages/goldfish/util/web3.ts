import { ethers } from 'ethers'
import { Interface } from '@ethersproject/abi'
import Web3Modal from 'web3modal'
import { toast } from 'react-toastify'

export const NONCE_MESSAGE = 'Please prove you control this wallet by signing this random text: '

export const nonce = () => Math.floor(Math.random() * 1000000).toString()

export const buildNonceMessage = (_nonce: string) => NONCE_MESSAGE + _nonce

export const buildContract = (tokenAddress: string, abi: object) => {
  const _provider = new ethers.providers.JsonRpcProvider(undefined, {
    chainId: 1337,
    name: 'hardhat',
  })

  return new ethers.Contract(tokenAddress, new Interface(JSON.stringify(abi)), _provider)
}

export const web3Connect = async (web3Modal: Web3Modal) => {
  if (window.ethereum) {
    try {
      if (process.env.NODE_ENV === 'development') {
        window.ethereum.networkVersion !== '1337' &&
          toast.info(
            "[This message is only show in development] Remember to switch manually to Localhost:8545 network. Switching automatically as with Mumbai doesn't work due to a metamask bug.",
            {
              autoClose: 10000,
              closeOnClick: true,
            }
          )
      } else {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [
            {
              chainId: '0x' + new Number(80001).toString(16),
            },
          ],
        })
      }
    } catch (error) {
      try {
        console.log('adding chain')
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x' + new Number(80001).toString(16),
              chainName: 'Mumbai',
              nativeCurrency: {
                name: 'MATIC',
                symbol: 'MATIC',
                decimals: 18,
              },
              rpcUrls: ['https://matic-mumbai.chainstacklabs.com'],
              blockExplorerUrls: ['https://mumbai.polygonscan.com'],
            },
          ],
        })
      } catch (addError) {
        console.error(addError)
      }
      console.error(error)
    }
  } else {
    alert('Metamask not installed')
    return
  }

  const instance = await web3Modal.connect()

  const provider = new ethers.providers.Web3Provider(
    instance,
    process.env.NODE_ENV === 'development'
      ? {
          chainId: 1337,
          name: 'hardhat',
        }
      : {
          chainId: 80001,
          name: 'mumbai',
        }
  )

  return provider
}

export const mintAQLF = async (
  tokenAddress: string,
  abi: object,
  amount: number,
  price: number,
  provider: ethers.providers.Web3Provider
) => {
  if (!provider) {
    return
  }

  const total = (amount * Math.round(price * 100)) / 100

  const signer = buildContract(tokenAddress, abi).connect(provider.getSigner())

  const nftTx = await signer.mintAQLF(amount, { value: ethers.utils.parseEther(total.toString()) })

  const tx = await nftTx.wait()

  if (tx.status) {
    return true
  }

  return false
}
