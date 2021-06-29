import Link from "next/link"
const Header = ({userData}) => {
  const {user, logout} = userData
  return (
    <div className="flex flex-row px-4 pt-3 border">
      <div className="md:box-content p-2">eventGate</div>
      {user ?
        <div className="md:box-content p-2 pb-4 ml-auto" onClick={logout}>ログアウト</div> :
        <div className="md:box-content p-2 pb-4 ml-auto"><Link href="/auth"><a>ログイン</a></Link></div>
      }
    </div>
  )
}

export default Header