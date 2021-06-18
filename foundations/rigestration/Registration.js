import { useState } from "react"
import { useUser } from "../../firebase/useUser"
import Discriptions from "./Discriptions"
import User from "./User"
import Gates from "./Gates"
import Token from "../../components/system/Token"
import { fetcher, initFetcher, setupAllGate } from "../../components/system/Fetcher"
import createEvent from "../../components/cloudFirestore/createEvent"

export default function Registration() {
  let { user, logout } = useUser()
  // console.log(user)
  const init = {
    eventId: "",
    eventName: "",
    page: "",
    organizer: "",
    email: "",
    start: "",
    end: "",
    discription: "",
    state: "private",
    userRegistrationItems: [],
    usersDbUrl: "",
    gatesUrl: [],
    resetTime: 0
  }
  const gate = "https://script.google.com/macros/s/AKfycbyn3xDxzxNHsvoBq67GN27Gga-wfB2q0PfBy_MUSLX-ZciJX_ejHbWWOAauX6S1HvtW/exec"
  const testInit = {
    eventId: "wasedasai",
    eventName: "早稲田祭",
    page: "wasedasai.net",
    organizer: "早稲田祭運営スタッフ",
    email: "wasedasai@wasedasai.net",
    start: "2021-06-09T18:02",
    end: "2021-06-09T18:02",
    discription: "今日は晴れ",
    state: "open",
    userRegistrationItems: [{ "header": "氏名", "type": "input" }, { "header": "カナ", "type": "input" }],
    usersDbUrl: "https://script.google.com/macros/s/AKfycbzS-2IMbrkG9nLfCdAufVkuZ26uR_gph27Uwr3vMiwEoiN5oPeoeNBctAdrgpTsp4WmWw/exec",
    gatesUrl: [{ geteName: "正門", gateUrl: gate }],
    resetTime: 4
  }
  const [forms, setForms] = useState(init)
  const [token] = useState(Token)
  const [submitState, setSubmitState] = useState(false)

  const handleChange = (e) => {
    const target = e.target;
    const name = e.target.name;
    const value = target.value;

    const newForm = { ...forms, [name]: value }
    setForms(newForm)
  }


  const eventRegister = (event) => {
    event.preventDefault()

    console.log(forms)
    if (!forms.gatesUrl.length) {
      alert("ゲート用ウェブアプリURLが未設定です")
      return
    } else if (!forms.userRegistrationItems.length) {
      alert("参加者データ収集項目は1つ以上登録してください。")
      return
    } else if (!forms.usersDbUrl) {
      alert("参加者データ用ウェブアプリURLが未設定、または未検証です。")
      return
    }
    setSubmitState("送信中")
    /**
     * 
     * @param {Stirng} type 
     * @returns {Object}
     */
    const getData = (type, access_token = token) => {
      return { "token": access_token, "access_token": token, type, ...forms }
    }

    fetcher(forms.usersDbUrl, getData("setup"))
      .then(res => {
        setSubmitState("参加者データ用ウェブアプリのセット完了")
        console.log(res)//folderId, sheetId
        return setupAllGate(res, getData("setup"))
      })
      .then(res => {
        setSubmitState("ゲート用ウェブアプリのセット完了")
        console.log(res)
        const url = process.env.NEXT_PUBLIC_EVENTS_DATABASE_URL
        const access_token = process.env.NEXT_PUBLIC_GAS_API_KEY
        return fetcher(url, getData("newEvent", access_token))
      })
      .then(res => {
        setSubmitState("イベント書き込み成功")
        const key = res["res"]
        console.log(key)
        console.log(forms.eventId)
        return createEvent({...forms, token, key, id:user.id } )
      })
      .then(key => {
        setSubmitState("管理者ページ作成成功")
        console.log(key)
        const url = process.env.NEXT_PUBLIC_EVENTS_DATABASE_URL
        const access_token = process.env.NEXT_PUBLIC_GAS_API_KEY
        return fetcher(url, {...getData("newEventOpen", access_token), key})
      }).then(res => {
        setSubmitState("イベント登録成功")
        const key = res["res"]
        const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
        const access_token = process.env.NEXT_PUBLIC_GAS_API_KEY
        return fetcher(url,  {...getData("newEvent", access_token), key, id:user.id})
      })
      .then(res => {
        console.log(res)
        setSubmitState("すべての処理が完了し、イベント作成に成功しました。")
      })
      .catch(e => {
        alert(e)
        console.log(e)
        setSubmitState("失敗")

      })
      


  }
  if (user) {
    return (
      <div className="registration-home">
        {/* テスト */}
        <input type="button" value="test" onClick={eventRegister} />
        {submitState}

        <Discriptions />
        <h2>イベント登録</h2>
        <form
          onSubmit={eventRegister}
        >
          <h3>イベント情報</h3>
          <label htmlFor="eventId">イベントID</label>
          <input id="eventId" name="eventId" type="text" defaultValue={forms.eventId} onChange={handleChange} required />
          <label htmlFor="eventName">イベント名</label>
          <input id="eventName" name="eventName" type="text" value={forms.eventName} onChange={handleChange} required />
          <label htmlFor="page">イベントURL</label>
          <input id="page" name="page" type="url" value={forms.page} onChange={handleChange} required />
          <label htmlFor="organizer">イベント主催者</label>
          <input id="organizer" name="organizer" type="text" value={forms.organizer} onChange={handleChange} required />
          <label htmlFor="email">問い合わせメールアドレス</label>
          <input id="email" name="email" type="mail" value={forms.email} onChange={handleChange} required />
          <label htmlFor="start">イベント開始日時</label>
          <input id="start" name="start" type="datetime-local" value={forms.start} onChange={handleChange} required />
          <label htmlFor="end">イベント終了日時</label>
          <input id="end" name="end" type="datetime-local" value={forms.end} onChange={handleChange} required />
          <label htmlFor="discription">イベント説明</label>
          <textarea id="discription" name="discription" type="datetime-local" rows="10" cols="90" value={forms.discription} onChange={handleChange} required />
          <User
            forms={forms}
            setForms={setForms}
            token={token}
          />
          <Gates
            forms={forms}
            setForms={setForms}
            handleChange={handleChange}
            token={token}
          />
          <button type="submit">Register</button>
        </form>
      </div>
    )
  } else return (
    <>
      <a href="/auth">LOGIN</a>
    </>
  )
}

