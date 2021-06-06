import { useState } from "react"
import { useUser } from "../../firebase/useUser"
import Discriptions from "./Discriptions"
import User from "./User"
import Gates from "./Gates"
import Token from "../../components/system/Token"
import { fetcher, initFetcher, setupAllGate } from "../../components/system/Fetcher"

export default function Registration() {
  let { user, logout } = useUser()
  // console.log(user)
  const init = {
    eventId: "",
    eventName: "",
    organizer: "",
    email: "",
    start: "",
    end: "",
    discription: "",
    userRegistrationItems: [],
    usersDbUrl: "",
    gatesUrl: [],
    resetTime: 0
  }
  const gate = "https://script.google.com/macros/s/AKfycbyn3xDxzxNHsvoBq67GN27Gga-wfB2q0PfBy_MUSLX-ZciJX_ejHbWWOAauX6S1HvtW/exec"
  const testInit = {
    eventId: "wasedasai",
    eventName: "早稲田祭",
    organizer: "早稲田祭運営スタッフ",
    email: "wasedasai@wasedasai.net",
    start: "2021-06-09T18:02",
    end: "2021-06-09T18:02",
    discription: "今日は晴れ",
    userRegistrationItems: [{"header": "氏名", "type": "input"},{"header": "カナ", "type": "input"}],
    usersDbUrl: "https://script.google.com/macros/s/AKfycbzS-2IMbrkG9nLfCdAufVkuZ26uR_gph27Uwr3vMiwEoiN5oPeoeNBctAdrgpTsp4WmWw/exec",
    gatesUrl: [gate],
    resetTime: 4
  }
  const [forms, setForms] = useState(testInit)
  const [token] = useState(Token)
  const [submitState, setSubmitState] = useState(false)

  const handleChange = (e) => {
    const target = e.target;
    const name = e.target.name;
    const value = target.value;
    console.log(value)

    const newForm = { ...forms, [name]: value }
    setForms(newForm)
  }


  const eventRegister = (event) => {
    event.preventDefault()
    setSubmitState("送信中")
    console.log(forms)
    if(!forms.gatesUrl.length){
      alert("ゲート用ウェブアプリURLが未設定です")
      return
    }else if(!forms.userRegistrationItems.length){
      alert("参加者データ収集項目は1つ以上登録してください。")
      return
    }
    const type = "setup"
    const data = { token, type }
    fetcher(forms.usersDbUrl, data).then(res => {
      setSubmitState("成功")
      console.log(res)
      
      return setupAllGate( res, token, forms.gatesUrl)
    }).then(res => {
      console.log(res)
    }).catch(e => {
      alert(e)
      setSubmitState("失敗")
    });


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

