import { useState } from "react"
import formClasses from "../../components/app/formClasses"
import { initFetcher } from "../../components/system/Fetcher"

export default function User({ forms, setForms, token }) {

  const [registrationHeader, setRegistrationHeader] = useState("")
  const [registrationType, setRegistrationType] = useState("input")
  const { blockClass, headerClass, boxClass, labelClass, discClass, inputClass, buttonClass }
    = formClasses("pc")

  const setNewUserRegistrationItems = (newUserRegistrationItems) => {
    const newForm = { ...forms, "userRegistrationItems": newUserRegistrationItems }
    setForms(newForm)
  }

  const addUserRegistrationItem = (e) => {
    e.preventDefault()
    console.log(registrationHeader, registrationType)
    if (!registrationHeader || !registrationType) {
      alert("空欄があります.")
      return
    }
    const header = registrationHeader
    const type = registrationType
    const newUserRegistrationItems = [...forms.userRegistrationItems, { header, type }]
    setNewUserRegistrationItems(newUserRegistrationItems)
    setRegistrationHeader("")
    setRegistrationType("input")
  }

  const deleteUserRegistrationItem = (e, index) => {
    e.preventDefault()
    const newUserRegistrationItems = forms.userRegistrationItems.filter((_, i) => i !== index)
    setNewUserRegistrationItems(newUserRegistrationItems)
  }


  const [usersUrlState, setUsersUrlState] = useState("未検証")
  const [inputUsersUrl, setInputUsersUrl] = useState("")



  const initUsersDb = (e) => {
    e.preventDefault()
    if (!inputUsersUrl) {
      alert('ウェブアプリURLを記入してください。')
      return
    }
    setUsersUrlState("検証中")
    initFetcher(inputUsersUrl, token).then(res => {
      setUsersUrlState("検証成功")
      const newForm = { ...forms, "usersDbUrl": inputUsersUrl }
      setForms(newForm)
    }).catch(e => {
      setUsersUrlState("検証失敗")
    })
  }

  return (
    <div className={blockClass}>
      <h3 className={headerClass}>参加者情報</h3>
      <p className={discClass}></p>
      <div className={boxClass}>
        <div>
          <h4 className={labelClass}>参加申し込みフォーム作成</h4>
          <p className={discClass}>他ユーザーがイベント参加を申し込むためのフォームを作成します。このイベント開催に際し必要な参加者の情報を設定します。</p>
          <label className={labelClass} htmlFor="infoName">項目名</label>
          <p className={discClass}>フォームの項目名を記入して下さい。</p>
          <input
            id="infoName"
            className={inputClass}
            type="text"
            value={registrationHeader}
            onChange={e => setRegistrationHeader(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="type">種類</label>
          <p className={discClass}>長文記述か短文記述か選択して下さい。</p>
          <select
            id="type"
            className={inputClass}
            type="text"
            value={registrationType}
            onChange={e => setRegistrationType(e.target.value)}
          >
            <option value="input" defaultValue>記述（短文）</option>
            <option value="textarea">記述（長文）</option>
          </select>
          <button className={buttonClass} onClick={addUserRegistrationItem}>登録・追加</button>
        </div>
        <div className="my-5">
          {forms.userRegistrationItems.length ? (
            <>
              <h5>フォーム内容</h5>
              <p className={discClass}>設定されたフォームを表示しています。</p>
            </>
          ) : <></>}
          <ul>
            {

              forms.userRegistrationItems.map(({ header, type }, index) => {
                const text = type === "input" ? header + ": 記述（短文）" : header + ": 記述（長文）";
                return (
                  <li key={index}>
                    <div className="flex flex-row px-2 my-2">
                      <p>{text}</p>
                      <button className={buttonClass + " ml-auto"} key={index} onClick={(e) => deleteUserRegistrationItem(e, index)}>削除</button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
      <div className={boxClass}>
        <h4 className={labelClass}>参加者データ用ウェブアプリURL</h4>
        <p className={discClass}>参加者データを保存するスプレッドシートを作成し、ウェブアプリURLを発行してください。検証が成功したら完了です。</p>
        <input
          id="userUrl"
          className={inputClass}
          type="url"
          value={inputUsersUrl}
          onChange={e => setInputUsersUrl(e.target.value)}
          required
        />
        <div className="flex flex-row">
          {
            usersUrlState === "検証中" ? <></> : <button className={buttonClass} onClick={initUsersDb}>検証</button>
          }
          <p className="px-4">{usersUrlState}</p>
        </div>
      </div>
    </div>
  )
}