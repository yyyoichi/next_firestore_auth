import { memo, useContext, useState } from "react"
import EnjiButton from "../../components/app/material/EnjiButton"
import { UserStateUiBox } from "../../components/app/material/UserStateUi"

const EditUsersTable = ({ usersData, eventData }) => {
  const [submitState, setSubmitState] = useState("proper")
  const [usersState, setUsersState] = useState({})//5:{accesstoken, state, userId}
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
      setUsersState(newUsersState)
    } else {
      const data = { userId, access_token, state }
      const newUsersState = { ...usersState, [rowIndex]: data }
      console.log(newUsersState)

      setUsersState(newUsersState)
    }
    console.log(usersState)
  }
  const eventRegister = (event) => {
    if (usersState == {}) return alert("操作がありませんでした")
    setSubmitState("submitting")
    event.preventDefault()

    console.log("send")
    console.log(usersState)
    return
    const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
    const token = process.env.NEXT_PUBLIC_GAS_API_KEY
    const data = {
      "type": "updateUsers",
      token,
      "path": `${eventId}/${key}`,
      usersState,
      "eventName": privateEventData["eventName"],
    }
    console.log(data)
    // return;
    fetcher(url, data)
      .then(res => {
        console.log("res")
        console.log(res)
        const updateUsers = res["res"]
        return getUsersDb(privateEventData, { "type": "updateUsers", "usersState": updateUsers })
      })
      .then(res => {
        console.log(res)
        setUsersState({})
        setUsersData(res)//新しいイベント参加者情報
        setSubmitState("processing")
      })

  }
  return (
    <div className="flex flex-col mx-auto px-2 md:w-4/5">
      <UsersTable registrationItems={eventData["registrationItems"]}>
        {
          usersData.map((user, i) => {
            return (
              <tr key={i}>
                <UserLabel
                  usersState={usersState}
                  user={user}
                  handleClick={handleClick}
                />
                <td>{user["state"]}</td>
                {user["info"].map(x => <td key={x}>{x}</td>)}
              </tr>
            )
          })
          // usersData.map((x, i) =>{<OneUser handle={handleClick} key={i} user={x} />})
        }
      </UsersTable>
      <SubmitStateUi submitState={submitState} eventRegister={eventRegister} />
    </div>

  )
}
export default EditUsersTable

const SubmitStateUi = memo(
  ({ submitState, eventRegister }) => {
    if (submitState !== "submitting") {
      const handleClick = e => eventRegister(e)
      return <button
        className="mx-auto mt-auto mb-5 py-2 px-6 bg-enji text-gray-50 rounded-md"
        handleClick={handleClick}>終了する</button>
    }
    return (
      <></>
    )
  }
  , (prevProps, nextProps) => prevProps.submitState === nextProps.submitState
)

const UserLabel = ({ user, handleClick, usersState }) => {
  const { rowIndex, access_token, userId } = user
  const initState = user["state"]
  const nowsUser = usersState[rowIndex] || user
  const editState = nowsUser["state"]
  const inputName = rowIndex + "&&" + userId + "&&" + access_token + "&&" + initState
  return (
    <td>
      <div>
        <label>
          <input
            type="radio"
            name={inputName}
            value="yes"
            onChange={(e) => handleClick(e)}
            checked={editState === "yes"}
          />
          許可</label>
        <label>
          <input
            type="radio"
            name={inputName}
            value="no"
            onChange={(e) => handleClick(e)}
            checked={editState === "no"}
          />
          不許可</label>
      </div>
    </td>
  )
}

const UsersTable = memo(
  ({ children, registrationItems }) => {
    return (
      <div className="h-100">
        <table className="block overflow-x-scroll whitespace-nowrap">
          <thead>
            <tr>
              <th>許可</th>
              <th>現状</th>
              {registrationItems.map(({ header }, i) => <th key={i}>{header}</th>)}
            </tr>
          </thead>
          <tbody>
            {children}
          </tbody>
        </table>

      </div>
    )
  }
  // , (prevProps, nextProps) => prevProps.registrationItems === nextProps.registrationItems
)