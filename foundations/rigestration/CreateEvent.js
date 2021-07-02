import { useRouter } from "next/router"
import { useState } from "react"
import createEvent from "../../components/cloudFirestore/createEvent"
import { fetcher, setupAllGate } from "../../components/system/Fetcher"
import { removeMyCookie } from "../../components/system/myCookie"
import Token from "../../components/system/Token"
import User from "./User"
import Gates from "./Gates"

/**
 * 
 * @param {array} heldEventsId
 * @returns 
 */
const CreateEvent = ({ user, heldEventsId }) => {
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
  const [forms, setForms] = useState(init)
  const token = Token
  const [submitState, setSubmitState] = useState(false)
  const router = useRouter()

  const handleChange = (e) => {
    const target = e.target
    const name = e.target.name
    const value = target.value
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
    const isSameId = heldEventsId.some(pastId => pastId === forms.eventId)
    if (isSameId) return alert("イベントIDが過去に作成したIDと重複しています")

    setSubmitState("送信中")
    /**
     * 
     * @param {Stirng} type 
     * @returns {Object}
     */
    const getData = (type, access_token = token) => {
      return { "token": access_token, "access_token": token, type, ...forms }
    }

    let eventKey;
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
        eventKey = key
        console.log(key)
        console.log(forms.eventId)
        return createEvent({ ...forms, token, key, id: user.id })
      })
      .then(key => {
        setSubmitState("管理者ページ作成成功")
        console.log(key)
        const url = process.env.NEXT_PUBLIC_EVENTS_DATABASE_URL
        const access_token = process.env.NEXT_PUBLIC_GAS_API_KEY
        const value = "OPEN"
        return fetcher(url, { ...getData("updateState", access_token), key: eventKey, value })
      }).then(res => {
        setSubmitState("イベント登録成功")
        const key = res["res"]
        console.log(res)
        const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
        const access_token = process.env.NEXT_PUBLIC_GAS_API_KEY
        return fetcher(url, { ...getData("newEvent", access_token), key: eventKey, id: user.id })
      })
      .then(res => {
        console.log(res)
        const path = `/organizer/${forms.eventId}/${eventKey}`
        console.log(path)
        setTimeout(() => router.push(path), 1000 * 2)
        removeMyCookie()
        setSubmitState("すべての処理が完了し、イベント作成に成功しました。2秒後に遷移します。")
      })
      .catch(e => {
        setSubmitState("イベント作成に失敗しました")
        console.log(e)
        const url = process.env.NEXT_PUBLIC_EVENTS_DATABASE_URL
        const access_token = process.env.NEXT_PUBLIC_GAS_API_KEY
        const value = "DELETE"
        return fetcher(url, { ...getData("updateState", access_token), "key": eventKey, value })
          .catch(e => alert(e))
      })
  }

  return (
    <>
      {/* テスト */}
      <input type="button" value="test" onClick={eventRegister} />
      {submitState}

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
    </>
  )
}

export default CreateEvent