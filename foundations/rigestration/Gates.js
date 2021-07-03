import { useState } from "react"
import formClasses from "../../components/app/formClasses"
import { initFetcher } from "../../components/system/Fetcher"

export default function Gates({ forms, handleChange, setForms, token }) {
  const [gateName, setGateName] = useState("")
  const [gateUrl, setGateUrl] = useState("")
  const [geteUsrState, setGateUrlState] = useState("未検証")
  const { blockClass, headerClass, boxClass, labelClass, discClass, inputClass, buttonClass }
    = formClasses("pc")


  //gatesUrl: [],
  // resetTime: ""
  const setNewGatesUrl = (newGatesUrl) => {
    const newForm = { ...forms, "gatesUrl": newGatesUrl }
    setForms(newForm)
  }

  const addGate = (e) => {
    e.preventDefault()
    console.log(gateUrl, gateName)
    if (!gateUrl && !gateName) {
      alert('ゲート名, ウェブアプリURLを記入してください')
      return
    } else if (!gateName) {
      alert('ゲート名を記入してください')
      return
    } else if (!gateUrl) {
      alert('ウェブアプリURLを記入してください')
      return
    }
    setGateUrlState("検証中")
    initFetcher(gateUrl, token).then(res => {
      const newGetesUrl = [...forms.gatesUrl, { gateName, gateUrl }]
      setNewGatesUrl(newGetesUrl)
      setGateUrl("")
      setGateName("")
      setGateUrlState("検証成功")
      setTimeout(() => setGateUrlState("未検証"), 1000)

    }).catch(e => {
      setGateUrlState("検証失敗")
    })
  }


  const deleteGate = (e, index) => {
    e.preventDefault()
    const gates = forms.gatesUrl;
    const newGatesUrl = gates.filter((_, i) => i !== index)
    setNewGatesUrl(newGatesUrl)
  }

  return (
    <div className={blockClass}>
      <h3 className={headerClass}>入退ゲート情報</h3>
      <p className={discClass}></p>
      <div className={boxClass}>
        <h4 className={labelClass}>入退ゲート名・ウェブアプリURL</h4>
        <p className={discClass}>入退を記録するスプレッドシートの設定を行います。場所が複数あるかつ大規模イベントの場合は、ゲートごとにGoogleアカウントを用意しスプレッドシートを作成・ウェブアプリURLを発行してください。</p>
        <div>
          <label className={labelClass} htmlFor="gateName">ゲート名</label>
          <p className={discClass}>入退する場所の名前を入力してください。</p>
          <input
            id="gateName"
            className={inputClass}
            type="text"
            value={gateName}
            onChange={e => setGateName(e.target.value)}
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="gateUrl">ウェブアプリURL</label>
          <p className={discClass}>参加者の入退状況を保存するスプレッドシートを作成し、ウェブアプリURLを発行してください。検証が成功したら完了です。</p>
          <input
            id="gateUrl"
            className={inputClass}
            type="url"
            value={gateUrl}
            onChange={e => setGateUrl(e.target.value)}
          />
        </div>
        <div className="flex flex-row">
          {
            geteUsrState === "検証中" ? <></> :
              <button className={buttonClass} onClick={addGate}>検証・追加</button>
          }
          <p className="px-4">{geteUsrState}</p>
        </div>
        {forms.gatesUrl.length ? (
          <>
            <h5>検証成功URL</h5>
            <p className={discClass}>設定に成功したURLを表示しています。</p>
          </>
        ) : <></>}
        <ul> {
          forms.gatesUrl.map(({ gateName }, index) => {
            return (
              <li key={index}>
                <div className="flex flex-row my-2">
                  <p className="">{gateName}</p>
                  <button
                    className="px-3 border-2 rounded-md ml-4"
                    key={index}
                    onClick={(e) => deleteGate(e, index)}>削除</button>
                </div>
              </li>
            )
          })
        }</ul>
      </div>
      <div className={boxClass}>
        <h4 className={labelClass}>入退データ更新時刻</h4>
        <p className={discClass}>もっとも入退を記録しない可能性の高い時刻に設定をしてください。</p>
        <select
          id="resetTime"
          className={inputClass}
          name="resetTime"
          defaultValue={forms.resetTime}
          onChange={handleChange}
          required>
          {getTimes().map((x, index) => <option key={index} value={x}>{x + "時"}</option>)}
        </select>
      </div>

    </div>
  )
}



const getTimes = () => {
  const hour = 24;
  let times = [];
  for (let i = 0; i < hour; i++) {
    times.push(i)
  }
  return times;
}
