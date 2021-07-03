import { memo, useState } from "react"
import { useUser } from "../../firebase/useUser"
import App from "../../components/app/app"
import { readMyData } from "../../components/system/readMyData"
import EnjiButton from "../../components/app/material/EnjiButton"
import { UserStateUiBox, FormHeader } from "../../components/app/material/UserStateUi"
import CreateEventDiscriptions from "./CreateEventDiscriptions"
import CreateEvent from "./CreateEvent"

export default function Registration() {
  const userData = useUser()
  const { user } = userData
  const [userState, setUserState] = useState("setup")
  const [heldEventsId, setHeldEventsId] = useState([])

  if (user && userState === "setup") {
    setUserState("getUserState")
    readMyData(user["id"])
      .then(res => {
        console.log(res)
        let createEvent = "showButton"
        if (res === "no-data") return setUserState(createEvent)
        /**
         * @type {array}
         */
        const join = res["organizer"]
        if (!join.length) return setUserState(createEvent)

        let heldEvents = []
        for (let i = 0; i < join.length; i++) {
          let x = join[i]
          heldEvents.push(x["eventId"])
        }
        setUserState(createEvent)
        setHeldEventsId(heldEvents)
      })
      .catch(e => {
        console.log(e)
        setUserState("failture")
      })
  }
  
  
  return (
    <App userData={userData} type="pc">
      <CreateEventDiscriptions />
      <UserStateUiBox>
        <UserStateUi userState={userState} setUserState={setUserState} />
      </UserStateUiBox>
      {
        userState === "open" ?
          <CreateEvent 
            user={user}
            heldEventsId={heldEventsId}
          /> :
          <></>
      }
    </App>
  )
}


const UserStateUi = memo(
  ({ userState, setUserState }) => {
    // console.log("userstate:" + userState)
    if (userState === "setup") {
      return <p>申込にはログインが必要です</p>
    }
    if (userState === "getUserState") {
      return <p>データ取得中です</p>
    }
    if (userState === "showButton") {
      const onClick = () => setUserState("open")
      return <EnjiButton onClick={onClick}>作成する</EnjiButton>
    }

    if (userState === "open") {
      return <FormHeader setUserState={setUserState} titleText="イベント作成" />
    }
    return (
      <p>{userState}</p>
    )
  }
  , (prevProps, nextProps) => prevProps.userState === nextProps.userState
)
