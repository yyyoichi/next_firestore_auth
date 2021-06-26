import { createContext, useState } from "react";
import { useUser } from "../../firebase/useUser";
import { fetcher, getUsersDb, getUsersDbViaFireStore } from "../../components/system/Fetcher";
import OneUser from "./UsersTable";

export const UsersStateContext = createContext()

export default function Users({ data }) {
  const { user, logout } = useUser()
  const { eventId, key, registrationItems } = data["registration"]

  const [usersData, setUsersData] = useState([])
  //eventName,gatesUrl, key, token, usersDbUrl
  const [dbData, setDbData] = useState({})//firestoreに保存されているデータ
  const [submitState, setSubmitState] = useState("proper")
  const [usersState, setUserState] = useState({})//5:{accesstoken, state, userId}

  if (user && submitState === "proper") {
    setSubmitState("processing")
    const type = "getUsers"
    getUsersDbViaFireStore(eventId, user["id"], { type })
      .then(({ resUsersData, resDbData }) => {
        setDbData(resDbData)
        setUsersData(resUsersData)
      })
  }

  const handleClick = (e) => {
    // console.log(e.target.value)
    // if (submitState === "submitting") return
    const name = e.target.name
    const [rowIndex, userId, access_token, initState] = name.split("&&")
    const state = e.target.value
    if (initState === state) {//元の値と同じとき
      // const {rowIndex, ...newUsersState} = usersState
      const newUsersState = { ...usersState, [rowIndex]: undefined }
      console.log(newUsersState)
      setUserState(newUsersState)
    } else {
      const data = { userId, access_token, state }
      const newUsersState = { ...usersState, [rowIndex]: data }
      setUserState(newUsersState)
    }
    console.log(usersState)
  }

  const eventRegister = (event) => {
    if (usersState == {}) return alert("操作がありませんでした")
    setSubmitState("submitting")
    event.preventDefault()

    console.log("send")
    console.log(usersState)

    const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
    const token = process.env.NEXT_PUBLIC_GAS_API_KEY
    const data = {
      "type": "updateUsers",
      token,
      "path": `${eventId}/${key}`,
      usersState,
    }
    // return;
    fetcher(url, data)
    .then(res => {
      console.log("res")
      console.log(res)
      const updateUsers = res["res"]
      return getUsersDb(dbData, { "type": "updateUsers", "usersState":updateUsers })
    })
    .then(res => {
      console.log(res)
      setUserState({})
      setUsersData(res)//新しいイベント参加者情報
      setSubmitState("processing")
    })
    
  }

  if (!user) return <a href="/auth">LOGIN</a>
  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>許可</th>
            <th>現状</th>
            {registrationItems.map(({ header }) => <th key={header}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          <UsersStateContext.Provider value={usersState}>
            {
              !usersData.length ?
                <tr><td>getData...</td></tr> :
                usersData.map(x => <OneUser handle={handleClick} key={x["userId"]} user={x} />)
            }
          </UsersStateContext.Provider>
        </tbody>
      </table>
      {
        submitState === "submitting" || !usersData.length ?
          <></> :
          <button onClick={(e) => eventRegister(e)}>send</button>
      }
    </div>
  )
}