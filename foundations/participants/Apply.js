import { useState } from "react";
import { fetcher } from "../../components/system/Fetcher";
import Token from "../../components/system/Token";
import { useUser } from "../../firebase/useUser";

export default function Page({ data }) {
  console.log(data)
  const { user, logout } = useUser(false)
  const { registrationItems, participantUrl, key, eventId } = data
  const access_token = Token()
  const [forms, setForms] = useState([])

  const createUi = ({ type }, i) => {
    // const formName = `index${i}`
    if (type === "input") {
      return <input type="text" name={i} value={forms[i]} onChange={handleChange} required />
    } else if (type === "textarea") {
      return <textarea name={i} value={forms[i]} onChange={handleChange} required />
    }
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
        const data = { token, 
          type: "newParty", 
          access_token, 
          id: user["id"], 
          path: `${eventId}/${key}` }
        return fetcher(url, data)
      })
      .catch(e => {
        alert(e)
        console.log(e)
      })
  }

  if (!user) {
    return <p>ログインするとイベント参加申請ができます。</p>
  } else {
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
}
