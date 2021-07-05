import { createContext, memo, useState } from "react";
import { useUser } from "../../firebase/useUser";
import { fetcher, getUsersDb, getUsersDbViaFireStore } from "../../components/system/Fetcher";
import OneUser from "./UsersTable";
import Wrapper from "../../components/app/App"
import { UserStateUiBox } from "../../components/app/material/UserStateUi";
import EditUsersTable from "./UsersTable";

export default function Users({ data }) {
  const userData = useUser()
  const { user } = userData
  const { eventId, key, registrationItems } = data["registration"]

  const [usersData, setUsersData] = useState([])
  //eventName,gatesUrl, key, token, usersDbUrl
  const [privateEventData, setPrivateEventData] = useState({})//firestoreに保存されているデータ
  const [setupState, setSetupState] = useState("setup")

  if (user && setupState === "setup") {
    setSetupState("getData")
    const type = "getUsers"
    getUsersDbViaFireStore(eventId, user["id"], { type })
      .then(response => {
        if (response === "no-data") {
          return setSetupState(response)
        }
        const { resUsersData, resDbData } = response
        if (!resUsersData.length) {
          return setSetupState("no-data")
        }
        setPrivateEventData(resDbData)
        setUsersData(resUsersData)
        setSetupState("open")
      })
  }

  return (
    <Wrapper userData={userData} type="pc">
      <UserStateUiBox>
        <SetupState setupState={setupState} />
      </UserStateUiBox>
      {setupState === "open" ?
        (
          <EditUsersTable
            usersData={usersData}
            eventData={{ ...privateEventData, ...data["registration"] }}
          />
        )
        : <></>
      }
    </Wrapper>
  )
}

const SetupState = memo(
  ({ setupState }) => {
    console.log(setupState)
    if (setupState === "setup") {
      return <p>ログインが必要です</p>
    }
    if (setupState === "getData") {
      return <p>データ取得中です。</p>
    }
    if (setupState === "open") {
      return <></>
    }
    return <></>
  }
  // , (prevProps, nextProps) => prevProps.qrState === nextProps.qrState
)