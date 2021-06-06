import { useState } from "react"
import { useUser } from "../../firebase/useUser"
import Discriptions from "./Discriptions"
import User from "./User"
import Gates from "./Gates"
import Token from "../../components/system/Token"

export default function Registration() {
  let { user, logout } = useUser()
  console.log(user)
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
    resetTime: ""
  }
  const [forms, setForms] = useState(init)
  const [token] = useState(Token)

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
  }
  if (user) {
    return (
      <div className="registration-home">
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

