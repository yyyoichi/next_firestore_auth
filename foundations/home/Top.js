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
      <App userData={userData}>
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
      <div className="container mx-auto font-ui-monospace">
        <MakeQr id={id} />
        <button onClick={logout}>logout</button>

        <div className="md:box-content bg-gray-100 p-4">
          <h2 className="text-purple-600">{name}さんの登録イベント</h2>
          {
            !myData ? <p>データ取得中</p> :
              myData === "no-data" ? <p>イベントが登録されていません</p> :
                myData === "failture" ? <p>イベント取得に失敗しました</p> :
                  <MyEventLibraly data={myData} />
          }
        </div>

        <Link href="/event/registration"><a className="text-green-900">イベントを主催する</a></Link>
      </div>
    </>
  )

}
  , (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
)

const MyEventLibraly = ({ data }) => {
  console.log(data)
  return (
    <>
      <Held events={data["organizer"]} />
      <Join parties={data["participant"]} />
    </>
  )
}


const Join = ({ parties }) => {
  if (!parties) return <></>
  /**
   * @param {String} party.eventName
   * @param {String} party.state
   * @param {String} party.path} party 
   */
  const Party = (party, i) => {
    const { eventName, state, path } = party
    const status = state === "process" ? "申請中" :
      state === "yes" ? "参加" : "参加不許可"
    const fullPath = "events/" + path
    return (
      <div key={i}>
        <p><span>{status}</span>{" "}
          <Link href={fullPath}><a>{eventName}</a></Link></p>
      </div>
    )
  }
  return (
    <div className="flex flex-row">
      <div className="flex flex-col">
        {/* <div><Image src="/../../public/icon/walk.png" layout="fill" /></div> */}
        <div className="mx-auto"><Image src="/icon/walk.png" width={50} height={50} /></div>
        <div className="mx-auto"><h3>JOIN</h3></div>
      </div>
      {parties.map(Party)}

    </div>
  )
}

const Held = ({ events }) => {
  if (!events) return <></>

  const Event = (eventProp, i) => {

    const { path, eventName } = eventProp
    const fullPath = "organizer/" + path
    const joinPath = "events/" + path
    return (
      <div key={i} className="box-border md:box-content p-4 border-4">
        <p>
          <Link href={fullPath} ><a>{eventName}</a></Link>
          {" "}
          <Link href={joinPath}><a>参加者募集ページ</a></Link>
        </p>
      </div>
    )
  }
  return (
    <div className="flex flex-col">
      <h3>主催イベント</h3>
      {events.map(Event)}
    </div>
  )
}
