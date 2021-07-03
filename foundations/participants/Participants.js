import EventInfo from "./EventInfo"
import Apply from "./Apply"
import App from "../../components/app/app"
import { useUser } from "../../firebase/useUser"
import { memo, useState } from "react";
import { readMyData } from "../../components/system/readMyData";
import EnjiButton from "../../components/app/material/EnjiButton";
import { UserStateUiBox, FormHeader } from "../../components/app/material/UserStateUi";

export default function Participants({ data }) {
  const userData = useUser(false)
  const { user, logout } = userData
  const { registrationItems, participantUrl, key, eventId, eventName } = data["registration"]
  const [userState, setUserState] = useState("setup")
  console.log(user)

  if (user && userState === "setup") {
    setUserState("getUserState")
    readMyData(user["id"])
      .then(res => {
        console.log(res)
        let thisEventState = "showButton"
        if (res === "no-data") return setUserState(thisEventState)//申込可
        /**
         * @type {array}
         */
        const join = res["participant"]
        if (!join.length) return setUserState(thisEventState)

        const path = eventId + "/" + key
        for (let i = 0; i < join.length; i++) {
          let x = join[i]
          if (x["path"] === path) {
            thisEventState = x["state"]
            break
          }
        }
        setUserState(thisEventState)//process/no/yes
      })
      .catch(e => {
        console.log(e)
        setUserState("failture")
      })
  }


  return (
    <>
      <App userData={userData}>
        <EventInfo data={data["eventData"]} />
        <UserStateUiBox>
          <UserStateUi
            userState={userState}
            setUserState={setUserState}
          />
        </UserStateUiBox>

        {
          userState === "open" ?
            <Apply
              data={data["registration"]}
              user={user}
              onSended={() => setUserState("setup")}
            />
            : <></>
        }
      </App>
    </>
  )
}

const UserStateUi = memo(
  ({ userState, setUserState }) => {
    console.log("userstate:" + userState)
    if (userState === "setup") {
      return <p>申込にはログインが必要です</p>
    }
    if (userState === "getUserState") {
      return <p>データ取得中です</p>
    }
    if (userState === "showButton") {
      const onClick = () => setUserState("open")
      return <EnjiButton onClick={onClick}>申し込む</EnjiButton>
    }
    if (userState === "yes") {
      return <p>参加が決定します</p>
    }
    if (userState === "no") {
      return <p>残念ながら不参加が決定しています</p>
    }
    if (userState === "process") {
      return <p>申込中です</p>
    }
    if (userState === "open") {
      return <FormHeader setUserState={setUserState} titleText="参加申込"/>
    }
    return (
      <p>{userState}</p>
    )
  }
  , (prevProps, nextProps) => prevProps.userState === nextProps.userState
)