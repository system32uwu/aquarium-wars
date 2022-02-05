import Image from 'next/image'
import * as React from 'react'
import HeaderLink from './headerLink'
import { FaFacebook, FaWallet } from "react-icons/fa"
import { EmailIcon, Icon } from "@chakra-ui/icons"
import { Button } from "@chakra-ui/react"

interface IProps { }

const Header: React.FC<IProps> = ({ }) => {
    return <header className="text-gray-600 body-font text-xl">
        <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                <Image width={200} height={200} src="/logo.png" quality={100} />
            </a>
            <nav className="md:ml-auto flex flex-wrap items-center justify-between font-bold">
                <HeaderLink title="Home" href="/" />
                <HeaderLink title="Play" href="/game" />
                <HeaderLink title="Marketplace" href="/marketplace" />
                <HeaderLink title="About" href="/about" />
                <HeaderLink title="Litepaper" href="/litepaper" />
            </nav>
            <Button insetBlockEnd={0.5} rounded="md" size="lg" fontSize="xl" rightIcon={<Icon as={FaWallet} />} p={4}>Connect to wallet</Button>
        </div>
    </header>
}

export default Header
