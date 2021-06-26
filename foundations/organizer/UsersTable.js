import { useContext, useState } from "react"
import { UsersStateContext } from "./Users"

export default function OneUser({ user, handle }) {
  const {  info } = user
  return (
    <tr>
      <UserStateTb handle={handle} user={user} />
      <td>{user["state"]}</td>
      <UserInfo info={info} />
    </tr>
  )
}

const UserStateTb = ({ user, handle }) => {
  const {rowIndex, state, access_token, userId} = user
  const userState = useContext(UsersStateContext)
  const nowstate = userState[rowIndex] || state
  const status = !nowstate["state"] ? state : nowstate["state"] ;
  const inputName = rowIndex +"&&" +userId +"&&" +access_token +"&&" +state
  return (
    <td>
      <div>
        <label>
          <input
            type="radio"
            name={inputName}
            value="yes"
            onChange={(e) => handle(e)}
            checked={status === "yes"}
          />
          許可</label>
        <label>
          <input
            type="radio"
            name={inputName}
            value="no"
            onChange={(e) => handle(e)}
            checked={status === "no"}
          />
          不許可</label>
      </div>
    </td>
  )
}

const UserInfo = ({ info }) => {
  return (
    <>
      {info.map(x => <td key={x}>{x}</td>)}
    </>
  )
}