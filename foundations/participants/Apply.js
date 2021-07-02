import { memo, useState } from "react";
import EnjiButton from "../../components/app/material/EnjiButton";
import { fetcher } from "../../components/system/Fetcher";
import { removeMyCookie } from "../../components/system/myCookie";
import { readMyData } from "../../components/system/readMyData";
import Token from "../../components/system/Token";
import { useUser } from "../../firebase/useUser";

export default function Page({ data, user, onSended }) {
  const { registrationItems, participantUrl, key, eventId, eventName } = data
  const access_token = Token()
  const [submitState, setSubmitState] = useState("ok")
  const [forms, setForms] = useState([])

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
    // return console.log("send!!")
    setSubmitState("sending")
    fetcher(participantUrl, { forms, access_token, type: "addUser", id: user["id"] })//個別データに保存
      .then(res => {
        // console.log(res)
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
      .then(res => {
        setSubmitState("sended")
        setTimeout(onSended, 500)
        removeMyCookie()
      })
      .catch(e => {
        alert(e)
        console.log(e)
      })
  }


  const createUi = ({ type }, i) => {
    // const formName = `index${i}`
    const inputClass = "border-2 rounded-sm"
    if (type === "input") {
      return (
        <input
          className={inputClass}
          type="text"
          name={i}
          value={forms[i]}
          onChange={handleChange}
          required
        />
      )
    } else if (type === "textarea") {
      return (
        <textarea
          className={inputClass}
          name={i}
          value={forms[i]}
          onChange={handleChange}
          required
        />
      )
    }
  }

  return (
    <>
      <form
        onSubmit={eventRegister}
        className="block w-3/4 mx-auto"
      >
        {
          registrationItems.map((item, i) => {
            return (
              <div
                className="flex flex-col my-3"
                key={i}
              >
                <div className="py-2 pl-1">{item["header"]}</div>
                {createUi(item, i)}
              </div>
            )
          })
        }
        <div className="flex mx-auto justify-center my-4">
          {
            submitState === "ok" ?
              (
                <EnjiButton type="submit">登録</EnjiButton>
              ) :
              submitState === "sending" ?
                (
                  <p>送信中</p>
                ) :
                (<>
                  <p>送信完了</p>
                </>
                )
          }
        </div>
      </form>
    </>
  )
}

