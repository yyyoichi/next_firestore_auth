import Link from "next/link"
const Footer = () => {
  return (
    <div className="flex flex-row py-8 bg-gray-700 mt-auto">
      <div className="app-title text-white text-lg mx-auto tracking-wide"><Link href="/"><a>egates</a></Link></div>
    </div>
  )
}
export default Footer