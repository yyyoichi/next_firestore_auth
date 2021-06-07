import { useState } from "react"
import { initFetcher } from "../../components/system/Fetcher"

export default function User({ forms, setForms, token }) {

  // forms.userRegistrationItems:[],
  //   forms.usersDbUrl:"",
  const [registrationHeader, setRegistrationHeader] = useState("")
  const [registrationType, setRegistrationType] = useState("input")

  const setNewUserRegistrationItems = (newUserRegistrationItems) => {
    const newForm = { ...forms, "userRegistrationItems": newUserRegistrationItems }
    setForms(newForm)
  }

  const addUserRegistrationItem = (e) => {
    e.preventDefault()
    console.log(registrationHeader, registrationType)
    if (!registrationHeader || !registrationType) {
      alert('項目名を記入してください')
      return
    }
    const header = registrationHeader
    const type = registrationType
    const newUserRegistrationItems = [...forms.userRegistrationItems, { header, type }]
    setNewUserRegistrationItems(newUserRegistrationItems)
    setRegistrationHeader("")
    setRegistrationType("input")
  }

  const deleteUserRegistrationItem = ( e, index) => {
    e.preventDefault()
    const newUserRegistrationItems = forms.userRegistrationItems.filter((_, i) => i !== index)
    setNewUserRegistrationItems(newUserRegistrationItems)
  }


  const [usersUrlState, setUsersUrlState] = useState("未検証")
  const [inputUsersUrl, setInputUsersUrl] = useState("")



  const initUsersDb = (e) => {
    e.preventDefault()
    console.log(inputUsersUrl)
    if (!inputUsersUrl) {
      alert('ウェブアプリURLを記入してください。')
      return
    }
    setUsersUrlState("検証中")
    const testURL = "https://script.google.com/macros/s/AKfycbzS-2IMbrkG9nLfCdAufVkuZ26uR_gph27Uwr3vMiwEoiN5oPeoeNBctAdrgpTsp4WmWw/exec";
    initFetcher(testURL, token).then(res => {
      setUsersUrlState("検証成功")
      const newForm = { ...forms, "usersDbUrl": inputUsersUrl }
      setForms(newForm)
    }).catch(e => {
      setUsersUrlState("検証失敗")
    })
  }

  return (
    <>
      <h3>参加者情報</h3>
      <h4>参加者データ収集項目</h4>
      <label htmlFor="infoName">登録項目名</label>
      <input
        id="infoName"
        type="text"
        value={registrationHeader}
        onChange={e => setRegistrationHeader(e.target.value)}
      />

      <label htmlFor="type">登録項目名</label>
      <select
        id="type"
        type="text"
        value={registrationType}
        onChange={e => setRegistrationType(e.target.value)}
      >
        <option value="input" defaultValue>記述（短文）</option>
        <option value="textarea">記述（長文）</option>
      </select>
      <button onClick={addUserRegistrationItem}>登録・追加</button>
      <ul>
        {
          forms.userRegistrationItems.map(({ header, type }, index) => {
            const text = type === "input" ? header + ", 記述（短文）" : header + ", 記述（長文）";
            return <li key={index}>
              {text}
              <button key={index} onClick={(e) => deleteUserRegistrationItem( e, index)}>削除</button>
            </li>
          })
        }
      </ul>
      <h4>参加者データ用ウェブアプリURL</h4>
      <input
        id="userUrl"
        type="url"
        value={inputUsersUrl}
        onChange={e => setInputUsersUrl(e.target.value)}
        required
      />
      {
        usersUrlState === "検証中" ? <></> : <button onClick={initUsersDb}>検証</button>
      }
      <p>{usersUrlState}</p>
    </>
  )
}