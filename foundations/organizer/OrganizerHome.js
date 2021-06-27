import { useRouter } from "next/router";
import { memo, useState } from "react";
import { fetcher, getUsersDbViaFireStore } from "../../components/system/Fetcher";
import { useUser } from "../../firebase/useUser";
import ReadQr from "../../components/qrcode/Reader";

export default function OrganizerHome() {
  const router = useRouter()
  const { key, eventid } = router.query
  const { user, logout } = useUser()

  const [dbData, setDbData] = useState(null)//firestoreに保存されているデータ
  const [usersData, setUsersData] = useState({})
  //Qr記録先のgateURLと入退のいずれか
  const [qrAccessBasics, setQrAccessBasics] = useState({ "gateUrl": "", "gateType": "" })
  const [submitState, setSubmitState] = useState("start")

  const [openQr, setQr] = useState(false)


  const handleClick = (e) => {
    console.log("click")
    const name = e.target.name
    const value = e.target.value
    setQr(false)
    const newBasics = { ...qrAccessBasics, [name]: value }
    setQrAccessBasics(newBasics)
    if (newBasics["gateUrl"] && newBasics["gateType"]) {
      if (submitState !== "go") setSubmitState("go")
      setTimeout(()=>{ setQr(true) },1000)
    } else {//未選択項目がある場合
      setSubmitState("prepair")
      setQr(false)
    }
  }

  const testClick = () => {
    const uid = "zhKOnhKOG3TBy7QHcSTPnS6ThWq1"
    const userdata = usersData[uid]
    console.log("\ttest_userData")
    console.log(userdata)
    console.log("admission: "+userdata["admission"])
  }

  const handleScan = data => {
    if (!data || submitState !== "go") return

    const reOpen = () => {
      setSubmitState("go")
      setQr(true)
    }
    const handleError = errorType => {
      setTimeout(reOpen, 1000 * 2)
      return setSubmitState(errorType)
    }

    setSubmitState("catching")//メッセージ変更
    setQr(false)//QRを閉じる

    //QRから情報を取り出す
    const [uid, qrTime] = data["text"].split("_timer_")

    const userData = usersData[uid]
    console.log("\tuserData")
    console.log(userData)
    //申請してしない
    if (!userData) handleError("no-entree")

    //QR生成時の時刻が10分前以上前なら不正なQrとして処理
    const timeLag = new Date().getTime() - qrTime
    const withinTheValidRange = timeLag > 10 * 60 * 1000
    const minute = Math.floor(timeLag / 1000 / 60)
    const second = Math.floor((timeLag / 1000) - minute * 60)

    console.log("timeLag(minute):" + minute + "m" + second)
    // console.log(data)

    //時間切れ
    // if (withinTheValidRange) return handleError("timeover")
  

    const { state, admission } = userData//
    const { gateType, gateUrl } = qrAccessBasics//選択中のQR読み込み設定
    console.log("\tqrAccessBasics")
    console.log(qrAccessBasics)
    //許可されていない
    if (state !== "yes") return handleError("reject")
    //2重記録
    if (admission === gateType) return handleError("double")

    const type = "enter"
    const token = dbData["token"]
    const usersDbUrl = dbData["usersDbUrl"]
    const fetchData = { type, token, gateType, userData }

    Promise.all([fetcher(usersDbUrl, fetchData),fetcher(gateUrl, fetchData)])
    .then(res => {
      console.log(res)
      const newUserData = res[0]["res"]
      const newUsersData = {...usersData, [uid]: newUserData}
      console.log("\tnewUserData")
      console.log(newUsersData[uid])
      setUsersData(newUsersData)
      reOpen()
    })
    .catch(e => {
      alert(e)
      console.error(e)
    })


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
          submitState === "no-entree" ? "参加者申請がされていません" :
            submitState === "reject" ? "入退が許可されていません" :
              submitState === "double" ? "既に記録済みです" :
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
      <button onClick={testClick}>button</button>
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
