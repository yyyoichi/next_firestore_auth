import { useRouter } from "next/router";
import { memo, useState } from "react";
import { fetcher, getUsersDbViaFireStore } from "../../components/system/Fetcher";
import { useUser } from "../../firebase/useUser";
import ReadQr from "../../components/qrcode/Reader";
import Wrapper from "../../components/app/app";
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
  const [qrAccessBasics, setQrAccessBasics] = useState({})
  const [qrState, setQrState] = useState("setup")

  //初期データの取得
  if (user && eventid && qrState === "setup") {
    setQrState("getQr")
    const type = "getUsersForReader"
    getUsersDbViaFireStore(eventid, user["id"], { type })
      .then(response => {
        if (response === "no-data") return setQrState("no-data")
        const { resUsersData, resDbData } = response
        setPrivateEventData(resDbData)
        const { token, usersDbUrl, eventName } = resDbData
        setQrAccessBasics((base) => {
          return { token, usersDbUrl, eventName, ...base }
        })
        setUsersData(resUsersData) 
        setQrState("showGrayButton")
        // setTimeout( console.log(qrAccessBasics), 2000)
      })
  }


  const onChangeSetting = (e) => {
    const name = e.target.name
    const value = e.target.value
    const newBasics = { ...qrAccessBasics, [name]: value }
    setQrAccessBasics(newBasics)
    if (newBasics["gateInfo"] && newBasics["gateType"]) {
      if (qrState !== "showButton") setQrState("showButton")
    } else {//未選択項目がある場合
      if (qrState !== "showGrayButton") setQrState("showGrayButton")
    }
  }

  return (
    <Wrapper userData={userData} type="pc">
      <QrSetting data={privateEventData} handleChange={onChangeSetting} />
      <QrStateUiBox qrState={qrState}>
        <QrState qrState={qrState} setQrState={setQrState} />
      </QrStateUiBox>
      {
        qrState === "open" ?
          <QrBox
            usersData={usersData}
            qrAccessBasics={qrAccessBasics}
            setQrState={setQrState}
          />
          : <></>
      }
    </Wrapper>
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
    if (qrState === "no-data") {
      return <p>データがありません</p>
    }
  }
  , (prevProps, nextProps) => prevProps.qrState === nextProps.qrState
)

const QrSetting = memo(({ data, handleChange }) => {
  const { formClass, blockClass, headerClass, boxClass, labelClass, discClass, inputClass, buttonClass }
    = formClasses()
  const eventName = data ? data["eventName"] : "取得中"
  const gatesUrl = data ? data["gatesUrl"] : []
  const selectText = data ? "選択して下さい" : "ゲートデータを取得しています..."
  return (
    <div className={formClass}>
      <h2 className={headerClass}>{eventName}</h2>
      <div className={boxClass}>
        <p className={discClass}>「入」「退」のどちらかと、入退を記録するゲート名を選択して下さい。</p>

        <h3 className={labelClass}>入退</h3>
        <div className="flex flex-row justify-around">
          <div>
            <label className="px-4">
              <input
                type="radio"
                name="gateType"
                value="enter"
                onChange={(e) => handleChange(e)}
              />
              入</label>
          </div>
          <div>
            <label className="px-4">
              <input
                type="radio"
                name="gateType"
                value="exit"
                onChange={(e) => handleChange(e)}
              />
              出</label>
          </div>
        </div>

      </div>
      <div className={boxClass}>
        <label className={labelClass}>入退ゲート</label>
        <select
          name="gateInfo"
          className={inputClass}
          onChange={(e) => handleChange(e)}
        >
          <option value={""}>{selectText}</option>
          {
            gatesUrl.map(({ gateUrl, gateName }) => {
              return (
                <option
                  key={gateName}
                  value={gateUrl + "&&" + gateName}
                >
                  {gateName}
                </option>
              )
            })
          }
        </select>
      </div>
    </div>
  )
}
  // , (prevProps, nextProps) => prevProps.data === nextProps.data
)
