import { useState } from "react"
import { FormHeader, UserStateUiBox } from "../../components/app/material/UserStateUi"
import ReadQr from "../../components/qrcode/Reader"

const QrBox = ({ setQrState }) => {
  const [scanState, setScanState] = useState("go")
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
  return (
    <>
      <UserStateUiBox>
        <FormHeader setState={setQrState} titleText="QR読み取り" />
      </UserStateUiBox>
      <ReadQr></ReadQr>
    </>
  )
}
// ,(prevProps, nextProps) => prevProps.qrState === nextProps.qrState
// )

export default QrBox