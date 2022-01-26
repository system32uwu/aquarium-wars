import Image from 'next/image'

export default function Layout({ children }) {
  return (
    <>
      <header className="text-gray-600 body-font">
        <a className="flex flex-row items-center justify-center">
          <div className="p-3">
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="logo"
            />
          </div>
        </a>
      </header>
      <main>{children}</main>
      {/* <Footer /> */}
    </>
  )
}
