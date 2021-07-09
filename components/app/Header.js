import Link from "next/link"
const Header = ({userData}) => {
  const {user, logout} = userData
  return (
    <div className="flex flex-row px-4 pt-3 border-b">
      <div className="app-title p-2 text-4xl text-enji tracking-wide"><Link href="/"><a>egates</a></Link></div>
      {user ?
        <div className="p-2 pb-4 ml-auto" onClick={logout}>{user["name"]}: ログアウト</div> :
        <div className="p-2 pb-4 ml-auto"><Link href="/auth"><a>ログイン</a></Link></div>
      }
    </div>
  )
}

export default Header