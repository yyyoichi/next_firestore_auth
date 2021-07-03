import { useRouter } from "next/router"
import { useState } from "react"
import createEvent from "../../components/cloudFirestore/createEvent"
import { fetcher, setupAllGate } from "../../components/system/Fetcher"
import { removeMyCookie } from "../../components/system/myCookie"
import Token from "../../components/system/Token"
import User from "./User"
import Gates from "./Gates"
import EnjiButton from "../../components/app/material/EnjiButton"
import formClasses from "../../components/app/formClasses"
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
  const { blockClass, headerClass, boxClass, labelClass, discClass, inputClass } = formClasses("pc")


  return (
    <div className="w-3/4 mx-auto">
      <form onSubmit={eventRegister}>
        <div className={blockClass}>
          <h3 className={headerClass}>イベント情報</h3>
          <div className={boxClass}>
            <label htmlFor="eventId" className={labelClass}>イベントID</label>
            <p className={discClass}>URLに使用されます。アカウント内で同じIDを使用することはできません。</p>
            <input
              id="eventId"
              className={inputClass}
              name="eventId"
              type="text"
              defaultValue={forms.eventId}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="eventName" className={labelClass}>イベント名</label>
            <p className={discClass}>参加者や参加検討者に表示されます。</p>
            <input
              id="eventName"
              className={inputClass}
              name="eventName"
              type="text"
              value={forms.eventName}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="page">イベントURL</label>
            <p className={discClass}>イベントに関係するWebサイトやSNSアカウントのURLを入力してください。</p>
            <input
              id="page"
              className={inputClass}
              name="page"
              type="url"
              value={forms.page}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="organizer">イベント主催者</label>
            <p className={discClass}>イベントを主催する団体名、個人名を入力してください。</p>
            <input
              id="organizer"
              className={inputClass}
              name="organizer"
              type="text"
              value={forms.organizer}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="email">問い合わせメールアドレス</label>
            <p className={discClass}>問い合わせを受けることのできるメールアドレスを入力してください。</p>
            <input
              id="email"
              className={inputClass}
              name="email"
              type="mail"
              value={forms.email}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="start">イベント開始日時</label>
            <p className={discClass}>イベントの開始日時を入力して下さい。</p>
            <input
              id="start"
              className={inputClass}
              name="start"
              type="datetime-local"
              value={forms.start}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="end">イベント終了日時</label>
            <p className={discClass}>イベントの終了日時を入力してください。</p>
            <input
              id="end"
              className={inputClass}
              name="end"
              type="datetime-local"
              value={forms.end}
              onChange={handleChange}
              required />
          </div>
          <div className={boxClass}>
            <label htmlFor="discription">イベント紹介</label>
            <p className={discClass}>イベントの概要や注意事項等あれば記入して下さい。</p>
            <textarea
              id="discription"
              className={inputClass}
              name="discription"
              type="datetime-local"
              value={forms.discription}
              onChange={handleChange}
              rows="10"
              required />
          </div>
        </div>
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
        <EnjiButton type="submit">登録</EnjiButton>
      </form>
    </div>
  )
}

export default CreateEvent