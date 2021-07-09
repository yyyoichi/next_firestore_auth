import {  memo, useState } from "react";
import { useUser } from "../../firebase/useUser";
import { getUsersDbViaFireStore } from "../../components/system/Fetcher";
import { UserStateUiBox } from "../../components/app/material/UserStateUi";
import EditUsersTable from "./UsersTable";
import WrapperPc from "../../components/app/AppPc";

export default function Users({ data }) {
  const userData = useUser()
  const { user } = userData
  const { eventId } = data["registration"]

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
    <WrapperPc userData={userData}>
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
    </WrapperPc>
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