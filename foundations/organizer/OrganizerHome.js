import { useRouter } from "next/router";
import { memo, useState } from "react";
import { getUsersDbViaFireStore } from "../../components/system/Fetcher";
import { useUser } from "../../firebase/useUser";
import ReadQr from "../../components/qrcode/Reader";

export default function OrganizerHome() {
  const router = useRouter()
  const { key, eventid } = router.query
  const { user, logout } = useUser()

  const [dbData, setDbData] = useState(null)//firestoreに保存されているデータ
  const [usersData, setUsersData] = useState([])
  //Qr記録先のgateURLと入退のいずれか
  const [qrAccessBasics, setQrAccessBasics] = useState({ "gateUrl": "", "gateType": "" })
  const [submitState, setSubmitState] = useState("start")

  const [openQr, setQr] = useState(false)


  const handleClick = (e) => {
    const name = e.target.name
    const value = e.target.value
    console.log("click")
    const newBasics = { ...qrAccessBasics, [name]: value }
    setQrAccessBasics(newBasics)
    // setQr(false)
    console.log(newBasics)
    if (newBasics["gateUrl"] && newBasics["gateType"]) {
      if (submitState !== "go") setSubmitState("go")
      if (!openQr) setQr(true)
    } else {//未選択項目がある場合
      setSubmitState("prepair")
      setQr(false)
    }
  }

  const handleScan = data => {
    // console.log(submitState)
    if (!data || submitState !== "go") {
      if (submitState !== "go") {
        // return console.log(submitState)
      }
      return
    }
    setSubmitState("catching")
    setQr(false)

    const [uid, qrTime] = data["text"].split("_timer_")

    //QR生成時の時刻が10分前以上前なら不正なQrとして処理
    const timeLag = new Date().getTime() - qrTime
    const withinTheValidRange = timeLag > 10 * 60 * 1000
    const minute = Math.floor(timeLag / 1000 / 60)
    const second = Math.floor((timeLag / 1000) - minute * 60)

    console.log("timeLag(minute):" + minute + "m" + second)
    // console.log(data)
    const reOpen = () => {
      setSubmitState("go")
      setQr(true)
      console.log(qrAccessBasics)
    }

    if (withinTheValidRange) {
      setTimeout(reOpen, 1000 * 2)
      return setSubmitState("timeover")
    }
    const userData = usersData[uid]

    //許可されていないあるいは申請してしない
    if (!userData || userData["state"] !== "yes") {
      setTimeout(reOpen, 1000 * 2)
      return setSubmitState("reject")
    }

    setTimeout(reOpen, 1000 * 2)
  }

  if (user && eventid && submitState === "start") {
    setSubmitState("prepair")
    const type = "getUsersForReader"
    getUsersDbViaFireStore(eventid, user["id"], { type })
      .then(({ resUsersData, resDbData }) => {
        setDbData(resDbData)
        setUsersData(resUsersData)
        // setSubmitState("go")
      })
  }
  const qrStateMassage = submitState === "prepair" ? "項目をすべて選択して下さい" :
    submitState === "go" ? "QR読み込み可能" :
      submitState === "catching" ? "処理中" :
        submitState === "timeover" ? "QRコードを更新してください" :
          submitState === "reject" ? "入退が許可されていません" :
            "";
  return (

    <>
      <div>{key}</div>
      {
        dbData ?
          <QrHome data={dbData} handleClick={handleClick} /> :
          <div>wait...</div>
      }
      <ReadQr handleScan={handleScan} open={openQr} />
      <div>{qrStateMassage}</div>
    </>
  )
}

const QrHome = memo(({ data, handleClick }) => {
  const {
    eventName,
    gatesUrl
  } = data
  return (
    <>
      <h2>
        {eventName}
      </h2>
      <div>
        <select
          name="gateUrl"
          onChange={(e) => handleClick(e)}
        >
          <option value={""}>選択してください</option>
          {
            gatesUrl.map(({ gateUrl, gateName }) => {
              return (
                <option
                  key={gateName}
                  value={gateUrl}
                >
                  {gateName}
                </option>
              )
            })
          }
        </select>
        <div>
          <label>
            <input
              type="radio"
              name="gateType"
              value="enter"
              onChange={(e) => handleClick(e)}
            />
            入</label>
          <label>
            <input
              type="radio"
              name="gateType"
              value="exit"
              onChange={(e) => handleClick(e)}
            />
            出</label>
        </div>
      </div>
    </>
  )
},
)
