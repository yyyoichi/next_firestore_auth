import { memo, useState } from "react"
import { FormHeader, UserStateUiBox as QrStateUiBox } from "../../components/app/material/UserStateUi"
import ReadQr from "../../components/qrcode/Reader"
import Modal from "../../components/app/material/Modal"
import { fetcher } from "../../components/system/Fetcher"

const QrBox = ({ setQrState, qrAccessBasics, usersData }) => {
  const { token, usersDbUrl, gateInfo, gateType, eventName } = qrAccessBasics
  const [gateUrl, gateName] = gateInfo.split("&&")
  const [scanState, setScanState] = useState("nutral")

  const reOpen = (minute = 0) => {
    return new Promise((resolve, reject) => {
      return setTimeout(() => {
        setScanState("nutral")
        resolve()
      }, minute)
    })
  }

  const handleError = errorType => {
    console.log("error: " + errorType)
    setScanState(errorType)
    return reOpen(2000)
  }

  const handleScan = async (data) => {

    console.log(data)

    setScanState("read")
    // return await reOpen(2000);
    //QRから情報を取り出す
    const [uid, qrTime] = data["text"].split("_timer_")

    const userData = usersData[uid]
    //申請してしない
    if (!userData) return handleError("no-entree")

    //QR生成時の時刻が10分前以上前なら不正なQrとして処理
    const timeLag = new Date().getTime() - qrTime
    const withinTheValidRange = timeLag > 10 * 60 * 1000
    const minute = Math.floor(timeLag / 1000 / 60)
    const second = Math.floor((timeLag / 1000) - minute * 60)
    console.log("timeLag(minute):" + minute + "m" + second)
    // console.log(data)

    //時間切れ
    if (withinTheValidRange) return handleError("timeover")

    const type = "enter"
    const fetchData = { type, token, gateType, userData }

    const res = await Promise.all([fetcher(usersDbUrl, fetchData), fetcher(gateUrl, fetchData)])
    const { error } = res[0]["res"]
    if (error === "double") {
      const recodeRow = res[1]["res"]
      console.log("recodeRow: " + recodeRow)
      fetcher(gateUrl, { token, row: recodeRow, type: "deleteRecode", gateType })
        .then(res => console.log(res));
      return handleError("double-" + gateType)
    }
    setScanState("success")
    reOpen(500)
  }
  const closeQr = () => setQrState("showButton")
  const typeClass = "px-2 text-5xl font-extrabold"
  //nutral, read, no-entry, double-, success
  const modalType = scanState === "nutral" ? "white"
    : scanState === "read" ? "gray"
      : scanState === "success" ? "blue"
        : "red"
  return (
    <Modal modalType={modalType}>
      <div className="px-2 py-2 bg-white bg-opacity-60">
        <h2>{eventName}</h2>
        <div className="flex flex-row justify-center">
          <div className={typeClass}>{gateName}</div>
          <div className={typeClass}>{gateType === "enter" ? "入" : "出"}</div>
        </div>
      </div>
      <QrScanStateProveder state={scanState}>
        <ReadQr open={true} handleScan={handleScan} />
      </QrScanStateProveder>
      <button className="mx-auto mt-auto mb-5 py-2 px-6 bg-enji text-gray-50 rounded-md" onClick={closeQr}>終了する</button>
    </Modal>
  )
}
// ,(prevProps, nextProps) => prevProps.qrState === nextProps.qrState
// )

const QrScanStateProveder = ({ children, state }) => {
  //nutral, read, no-entry, double-, success
  let stateText = "読み込み可能です"
  let textSize = "text-5xl"
  const errorSize = "text-4xl"

  if (state === "read") {
    stateText = "読み込み中"
  } else if (state === "no-entry") {
    stateText = "参加が許可されていません"
    textSize = errorSize
  } else if (state === "double-enter") {
    stateText = "すでに入場しています"
    textSize = errorSize
  } else if (state === "double-exit") {
    stateText = "すでに退場しています"
    textSize = errorSize
  } else if (state === "success") {
    stateText = "記録しました"
    textSize = errorSize
  }

  return (
    <div className="md:w-1/2 md:mx-auto">
      {children}
      <p className={"py-4 w-full bg-gblack text-center text-gray-50 h-20 " + textSize}>{stateText}</p>
    </div>
  )
}


export default QrBox