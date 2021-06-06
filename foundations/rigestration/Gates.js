import { useState } from "react"
import { initFetcher } from "../../components/system/Fetcher"

export default function Gates({ forms, handleChange, setForms, token }) {
  const [gateName, setGateName] = useState("")
  const [gateUrl, setGateUrl] = useState("")
  const [geteUsrState, setGateUrlState] = useState("未検証")

  
//gatesUrl: [],
// resetTime: ""
  const setNewGatesUrl = (newGatesUrl) => {
    const newForm = {...forms, "gatesUrl": newGatesUrl }
    setForms(newForm)
  }

  const addGate = async () => {
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
    const testURL = "https://script.google.com/macros/s/AKfycbzS-2IMbrkG9nLfCdAufVkuZ26uR_gph27Uwr3vMiwEoiN5oPeoeNBctAdrgpTsp4WmWw/exec";
    const res = await initFetcher(testURL, token)
    if (res) {
      const newGetesUrl = [...forms.gatesUrl,{gateName, gateUrl}]
      setNewGatesUrl(newGetesUrl)
      setGateUrl("")
      setGateName("")
      setGateUrlState("未検証")
    }else{
      setGateUrlState("検証失敗")
    }
  }

  const deleteGate = (index) => {
    const newGatesUrl = forms.getesUrl.filter((_, i) => i !== index)
    setNewGatesUrl(newGatesUrl)
  }

  return (
    <>

      <h3>入退ゲート情報</h3>

      <h4>入退ゲート名・ウェブアプリURL</h4>
      <div>
        <label htmlFor="gateName">ゲート名</label>
        <input
          id="gateName"
          type="text"
          value={gateName}
          onChange={e => setGateName(e.target.value)}
        />

        <label htmlFor="gateUrl">ウェブアプリURL</label>
        <input
          id="gateUrl"
          type="url"
          value={gateUrl}
          onChange={e => setGateUrl(e.target.value)}
        />
        {
          geteUsrState==="検証中" ? <></> : <button onClick={addGate}>検証・追加</button>
        }
        <p>{geteUsrState}</p>
        <ul>{forms.gatesUrl.length ? <h5>検証成功</h5> : <></>}
          {
            forms.gatesUrl.map(({ gateName, gateUrl }, index) => {

              return <li key={index}>
                {gateName + ", " + gateUrl}
                <button key={index} onClick={() => deleteGate(index)}>削除</button>
              </li>
            })
          }
        </ul>
        <h4>入退データ更新時刻</h4>
        <p>もっとも入退を記録しない可能性の高い時刻に設定をしてください。</p>
        <select id="resetTime" name="resetTime" defaultValue={forms.resetTime} onChange={handleChange} required>
          {/* <option value={0} defaultValue>0時</option> */}
          {getTimes().map((x, index) => <option key={index} value={x}>{x + "時"}</option>)}
        </select>
      </div>
    </>
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
