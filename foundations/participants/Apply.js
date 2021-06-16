import { useState } from "react";
import { fetcher } from "../../components/system/Fetcher";
import Token from "../../components/system/Token";
import { useUser } from "../../firebase/useUser";

export default function Page({ data }) {
  console.log(data)
  const { user, logout } = useUser(false)
  const { registrationItems, participantUrl } = data
  const token = Token()
  const [forms, setForms] = useState({ "access_token": token })

  const createUi = ({ type }, i) => {
    const formName = `index${i}`
    if (type === "input") {
      return <input type="text" name={formName} value={forms[formName]} onChange={handleChange} required />
    } else if (type === "textarea") {
      return <textarea name={formName} value={forms[formName]} onChange={handleChange} required />
    }
  }

  const handleChange = (e) => {
    const target = e.target
    const name = e.target.name
    const value = target.value

    const newForm = { ...forms, [name]: value }
    setForms(newForm)
    fetcher(url)
  }

  const eventRegister = (event) => {
    event.preventDefault()
    fetcher(participantUrl, { forms, type: "addUser" })
      .then(res => {
        const key = res["res"]
        const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
        const token = process.env.NEXT_PUBLIC_GAS_API_KEY
        return fetcher(url, { token, type: "newParty", ...forms })
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
