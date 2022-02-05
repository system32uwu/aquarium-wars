import * as React from 'react'
import Link from "next/link"

interface IProps {
    title: string
    href: string
}
const HeaderLink: React.FC<IProps> = ({ title, href }) => (
    <div className="mr-5 hover:text-gray-900 p-2 cursor-pointer text-blue-50">
        <Link href={href} >{title}</Link>
    </div>
)

export default HeaderLink
