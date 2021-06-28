import { useUser } from "../../firebase/useUser"
import MakeQr from "../../components/qrcode/Make";
import Lp from './Lp'
import { memo, useState } from "react";
import { readMyData } from "../../components/system/readMyData";
import Link from "next/link"
import { mapUserData } from "../../firebase/mapUserData";

export default function Top() {
  const { user, logout } = useUser()
  if (user) {
    return <MyPage user={user} logout={logout} />
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

  const MyEventLibraly = ({ data }) => {
    console.log(data)
    return (
      <>
        <Join parties={data["participant"]} />
        <Held events={data["organizer"]} />
      </>
    )
  }
  return (
    <>
      <MakeQr id={id} />
      <button onClick={logout}>logout</button>
      <h2>{name}さんの登録イベント</h2>
      {
        !myData ? <p>データ取得中</p> :
          myData === "no-data" ? <p>イベントが登録されていません</p> :
            myData === "failture" ? <p>イベント取得に失敗しました</p> :
              <MyEventLibraly data={myData} />
      }
      <Link href="/event/registration"><a>イベントを主催する</a></Link>
    </>
  )

}
  , (prevProps, nextProps) => prevProps.user.id === nextProps.user.id
)


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
    <div>
      <h3>参加イベント</h3>
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
      <div key={i}>
        <p>
          <Link href={fullPath} ><a>{eventName}</a></Link>
          {" "}
          <Link href={joinPath}><a>参加者募集ページ</a></Link>
        </p>
      </div>
    )
  }
  return (
    <div>
      <h3>主催イベント</h3>
      {events.map(Event)}
    </div>
  )
}
