import { memo, useState } from "react";
import { fetcher } from "../../components/system/Fetcher";
import { readMyData } from "../../components/system/readMyData";
import Token from "../../components/system/Token";
import { useUser } from "../../firebase/useUser";

export default function Page({ data }) {
  console.log(data)
  const { user, logout } = useUser(false)
  const { registrationItems, participantUrl, key, eventId, eventName } = data
  const access_token = Token()
  const [thisEventState, setThisEventState] = useState("")
  const [submitState, setSubmitState] = useState("start")
  const [forms, setForms] = useState([])

  if (user && submitState === "start") {
    setSubmitState("set")
    readMyData(user["id"])
      .then(res => {
        /**
         * @type {array}
         */
        const join = res["participant"]
        let thisEvent = "noApply";
        if (!join.length) return setThisEventState(thisEvent)
        const path = eventId + "/" + key
        for (let i = 0; i < join.length; i++) {
          const x = join[i]
          if (x["path"] === path) {
            thisEvent = x
            break
          }
        }
        setThisEventState(thisEvent)
      })
      .catch(e => {
        console.log(e)
        setThisEventState("failture")
      })
  }

  const handleChange = (e) => {
    const target = e.target
    const i = + e.target.name
    const value = target.value

    const newForm = [...forms]
    newForm[i] = value
    setForms(newForm)
    console.log(forms)
    // fetcher(url)
  }

  const eventRegister = (event) => {
    event.preventDefault()
    fetcher(participantUrl, { forms, access_token, type: "addUser", id: user["id"] })
      .then(res => {
        console.log(res)
        const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
        const token = process.env.NEXT_PUBLIC_GAS_API_KEY
        const data = {
          token,
          type: "newParty",
          access_token,
          id: user["id"],
          path: `${eventId}/${key}`,
          eventName
        }
        return fetcher(url, data)
      })
      .catch(e => {
        alert(e)
        console.log(e)
      })
  }

  const createUi = ({ type }, i) => {
    // const formName = `index${i}`
    if (type === "input") {
      return <input type="text" name={i} value={forms[i]} onChange={handleChange} required />
    } else if (type === "textarea") {
      return <textarea name={i} value={forms[i]} onChange={handleChange} required />
    }
  }




  if (!user) {
    return <p>ログインするとイベント参加申請ができます。</p>
  }
  if (!thisEventState) {
    return <p>イベント参加状況を問い合わせ中</p>
  }
  
  if (thisEventState !== "noApply") {//GASにデータ在り
    const state = thisEventState["state"]
    const statusMessage = state === "process" ? "すでに参加を申請しています" :
      state === "yes" ? "参加が決定しています" : "残念ながら不参加となりました"
    return <p>{statusMessage}</p>
  }
  // if (thisEventState === "noApply") {

  return (
    <>
      <h2>参加申請</h2>
      <form
        onSubmit={eventRegister}
      >
        {registrationItems.map((item, i) => {
          console.log(item)
          const { header } = item
          return (
            <div key={i}>
              <label>{header}:</label>{createUi(item, i)}
            </div>
          )
        })
        }
        <button type="submit">Register</button>
      </form>
    </>
  )
}

const Apply = memo(
  ({ user, registrationItems }) => {


  }

)

