import { useUser } from "../../firebase/useUser"
import MakeQr from "../../components/qrcode/Make";
import Lp from './Lp'
import { memo, useState } from "react";
import { readMyData } from "../../components/system/readMyData";
import Link from "next/link"
import Image from "next/image"
import App from "../../components/app/app";

export default function Top() {
  const userData = useUser()
  const { user, logout } = userData
  if (user) {
    return (
      <App userData={userData} type="sp">
        <MyPage user={user} logout={logout} />
      </App>
    )
  } else return <Lp />
}

const MyPage = memo(({ user, logout }) => {
  console.log("render")
  const { id, name } = user
  const [myData, setMyData] = useState("")
  if (!myData) {
    readMyData(id)
      .then(data => {
        console.log(data)
        setMyData(data)
      })
      .catch(e => setMyData("failture"))
  }

  return (
    <>
      <MakeQr id={id} />
      <Card type="join">
        <Join data={myData} />
      </Card>
      <Card type="held">
        <Held data={myData} />
      </Card>
    </>
  )

}
  , (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
)

const Card = ({ children, type }) => {
  const color = type === "join" ? "enji" : "rakuda"
  const src = type === "join" ? "/icon/walk.png" : "/icon/held.png"
  const className = "flex flex-col relative my-20 pt-16 pb-20 text-white rounded-t-xl shadow-lg bg-" + color
  const roundedClass = "absolute w-20 h-20 left-1/2 transform -translate-x-1/2 -top-6 pt-1.5 pl-2 rounded-full bg-white border-8 border-" + color
  return (
    <div className={className}>
      <div className={roundedClass}>
        <Image src={src} width={48} height={48} className="" />
      </div>
      {children}
    </div>
  )
}

const TypeHeader = ({ children, type }) => {
  const text = type === "yes" ? "参加" : type === "no" ? "不参加" : type === "process" ? "参加申込中" : "主催イベント";
  return (
    <>
      <div className="pt-6 mb-3 w-3/4 mx-auto text-xl text-center border-b-2 border-gray-50 rounded-b-sm">{text}</div>
      <div className="flex flex-col text-gray-50">
        {children}
      </div>
    </>
  )
}

const cellClass = "flex flex-row w-3/5 mx-auto my-2 px-4 py-1 text-lg text-center border-b border-gray-50 rounded-b-sm"
const tempCellClass = "w-3/5 mx-auto my-10 px-4 py-1 text-lg text-center border-b border-gray-50 rounded-b-sm"

const Join = memo(
  ({ data }) => {
    if (!data) return <div className={cellClass}>イベント取得中です</div>
    if (data === "no-data") return <div className={cellClass}>参加予定のイベントがありません</div>
    if (data === "failture") return <div className={cellClass}>イベント取得に失敗しました</div>

    const Party = ({ party, type }) => {
      if (!party.length) return <></>

      return (
        <TypeHeader type={type}>
          {
            party.map((x, i) => {
              const { eventName, path } = x
              return (
                <div key={i} className={cellClass}>
                  <Link href={path}><a className="block w-full">{eventName}</a></Link>
                  <div className="rounded-full bg-white w-7 h-7 ml-auto">
                    <Image className="" src="/icon/right2.png" width={15} height={15} />
                  </div>
                </div>
              )
            })
          }
        </TypeHeader>
      )
    }
    /**
     * @type {Array{}}
     */
    const participant = data["participant"]
    let process = []
    let yes = []
    let no = []
    let reject = []
    let parties = { process, yes, no, reject }
    for (let i = 0; i < participant.length; i++) {
      let p = participant[i]
      let { state, eventName } = p
      let path = "events/" + p["path"]
      parties[state].push({ eventName, path })
    }
    return (
      <>
        <Party party={parties["yes"]} type="yes" />
        <Party party={parties["process"]} type="process" />
        <Party party={parties["no"]} type="no" />
      </>
    )
  }
  , (prevProps, nextProps) => prevProps.data === nextProps.data
)

const Held = memo(
  ({ data }) => {
    if (!data) return <div className={tempCellClass}>イベント取得中です</div>
    if (data === "no-data" || !data["organizer"].length) {
      return (
        <div className={tempCellClass}>
          <Link href="/event/registration"><a className={tempCellClass}>イベントを作成する</a></Link>
        </div>
      )
    }
    if (data === "failture") return <div className={tempCellClass}>イベント取得に失敗しました</div>


    const Event = (eventProp, i) => {

      const { path, eventName } = eventProp
      const fullPath = "organizer/" + path
      // const joinPath = "events/" + path
      return (
        <div key={i} className={cellClass}>
          <Link href={fullPath}><a className="block w-full">{eventName}</a></Link>
          <div className="rounded-full bg-white w-7 h-7 ml-auto">
            <Image className="" src="/icon/right2.png" width={15} height={15} />
          </div>
        </div>
      )
    }
    return (
      <TypeHeader type="held">
        {
          data["organizer"].map(Event)
        }
        <div className={tempCellClass}>
          <Link href="/event/registration"><a className="">イベントを作成する</a></Link>
        </div>
      </TypeHeader>
    )
  }
  , (prevProps, nextProps) => prevProps.data === nextProps.data
)
