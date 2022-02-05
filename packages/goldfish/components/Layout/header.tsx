import Image from 'next/image'
import * as React from 'react'
import HeaderLink from './headerLink'
import { FaWallet } from "react-icons/fa"
import { Icon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"
import Link from 'next/link'
import { useWalletStore } from '../../store/web3'
import ConnectButton from './connectButton'
import Account from './account'

interface IProps { }

const Header: React.FC<IProps> = ({ }) => {
    const { instance } = useWalletStore()

    return <header className="text-gray-600 body-font text-xl">
        <div className="container flex flex-wrap p-2 flex-col md:flex-row items-center mx-auto">

            <Link href="/">
                <a>
                    <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <Image width={250} height={250} src="/logo.png" quality={100} />
                    </div>
                </a>
            </Link>

            <nav className="md:ml-auto flex flex-wrap items-center justify-between font-black">
                <HeaderLink title="Home" href="/" />
                <HeaderLink title="Play" href="/game" />
                <HeaderLink title="Marketplace" href="/marketplace" />
                <HeaderLink title="About" href="/about" />
                <HeaderLink title="Litepaper" href="/litepaper" />
            </nav>
            {
                !instance ? <ConnectButton /> : <Account />
            }
        </div>
    </header>
}

export default Header
