import { useRouter } from "next/router";
import { memo, useState } from "react";
import { fetcher, getUsersDbViaFireStore } from "../../components/system/Fetcher";
import { useUser } from "../../firebase/useUser";
import ReadQr from "../../components/qrcode/Reader";
import App from "../../components/app/app";
import formClasses from "../../components/app/formClasses";
import EnjiButton from "../../components/app/material/EnjiButton";
import { FormHeader, UserStateUiBox as QrStateUiBox } from "../../components/app/material/UserStateUi";
import GrayButton from "../../components/app/material/GrayButton";
import QrBox from "./QrBox";

export default function OrganizerHome() {
  const router = useRouter()
  const { key, eventid } = router.query
  const userData = useUser()
  const { user } = userData

  const [privateEventData, setPrivateEventData] = useState(null)//firestoreに保存されているデータ
  const [usersData, setUsersData] = useState({})
  //Qr記録先のgateURLと入退のいずれか
  const [qrAccessBasics, setQrAccessBasics] = useState({ "gateUrl": "", "gateType": "" })
  const [submitState, setSubmitState] = useState("start")
  const [qrState, setQrState] = useState("setup")

  if (user && eventid && qrState === "setup") {
    setQrState("getQr")
    const type = "getUsersForReader"
    getUsersDbViaFireStore(eventid, user["id"], { type })
      .then(({ resUsersData, resDbData }) => {
        setPrivateEventData(resDbData)
        setUsersData(resUsersData)
        setQrState("showGrayButton")
      })
  }

  const [openQr, setQr] = useState(false)

  const onChangeSetting = (e) => {
    console.log("click")
    const name = e.target.name
    const value = e.target.value
    const newBasics = { ...qrAccessBasics, [name]: value }
    setQrAccessBasics(newBasics)
    if (newBasics["gateUrl"] && newBasics["gateType"]) {
      if (qrState !== "showButton") setQrState("showButton")
    } else {//未選択項目がある場合
      if (qrState !== "showGrayButton") setQrState("showGrayButton")
    }
    console.log(qrState)
  }

  const testClick = () => {
    const uid = "zhKOnhKOG3TBy7QHcSTPnS6ThWq1"
    const userdata = usersData[uid]
    console.log("\ttest_userData")
    console.log(userdata)
    console.log("admission: " + userdata["admission"])
  }

  const handleScan = data => {
    if (!data || submitState !== "go") return

    setSubmitState("catching")
    console.log(data)


    const reOpen = (minute = 0) => {
      if (minute) {
        return setTimeout(reOpen, minute)
      }
      setSubmitState("go")
      setQr(true)
    }
    return reOpen(2000)


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

    Promise.all([fetcher(usersDbUrl, fetchData), fetcher(gateUrl, fetchData)])
      .then(res => {
        console.log(res)
        const newUserData = res[0]["res"]
        const newUsersData = { ...usersData, [uid]: newUserData }
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

  const qrStateMassage = submitState === "prepair" ? "データを取得しています" :
    submitState === "haveData" ? "項目をすべて選択して下さい" :
      submitState === "go" ? "QR読み込み可能" :
        submitState === "catching" ? "処理中" :
          submitState === "timeover" ? "QRコードを更新してください" :
            submitState === "no-entree" ? "参加者申請がされていません" :
              submitState === "reject" ? "入退が許可されていません" :
                submitState === "double" ? "既に記録済みです" :
                /*start*/"データ収集準備中";
  return (
    <>
      <App userData={userData}>
        <QrSetting data={privateEventData} handleChange={onChangeSetting} />
        <QrStateUiBox qrState={qrState}>
          <QrState qrState={qrState} setQrState={setQrState} />
        </QrStateUiBox>
        {
          qrState === "open" ? <QrBox setQrState={setQrState} /> : <></>
        }

      </App>
    </>
  )
}

const QrState = memo(
  ({ qrState, setQrState }) => {
    if (qrState === "setup") {
      return <p>準備中</p>
    }
    if (qrState === "getQr") {
      return <p>データ取得中</p>
    }
    if (qrState === "showGrayButton") {
      return <GrayButton>QRリーダーを開く</GrayButton>
    }
    if (qrState === "showButton") {
      return <EnjiButton onClick={() => setQrState("open")}>QRリーダーを開く</EnjiButton>
    }
    if (qrState === "open") {
      return <></>
    }
  }
  , (prevProps, nextProps) => prevProps.qrState === nextProps.qrState
)

const QrSetting = memo(({ data, handleChange }) => {
  const { formClass, blockClass, headerClass, boxClass, labelClass, discClass, inputClass, buttonClass }
    = formClasses()
  const eventName = data ? data["eventName"] : "取得中"
  const gatesUrl = data ? data["gatesUrl"] : []
  return (
    <div className={formClass}>
      <h2 className={headerClass}>{eventName}</h2>
      <div className={boxClass}>
        <p className={discClass}>入退を記録するゲート名と「入」「退」のどちらかを選択して下さい。</p>
        <label className={labelClass}>入退ゲート</label>
        <select
          name="gateUrl"
          className={inputClass}
          onChange={(e) => handleChange(e)}
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
      </div>
      <div className={boxClass}>
        <label>
          <input
            type="radio"
            name="gateType"
            value="enter"
            onChange={(e) => handleChange(e)}
          />
          入</label>
      </div>
      <div className={boxClass}>
        <label>
          <input
            type="radio"
            name="gateType"
            value="exit"
            onChange={(e) => handleChange(e)}
          />
          出</label>
      </div>
    </div>
  )
}
  // , (prevProps, nextProps) => prevProps.data === nextProps.data
)
