import { useEffect, useState } from "react";
import { useUser } from "../../firebase/useUser";
import { readEventData } from "../../components/cloudFirestore/readEvent";
import { fetcher } from "../../components/system/Fetcher";

export default function Users({ data }) {
  const { user, logout } = useUser()
  const { eventId, key, registrationItems } = data["registration"]

  const [usersData, setUsersData] = useState([])
  const [yetApi, setApi] = useState(true)
  if (user && yetApi) {
    setApi(false)
    readEventData(eventId, user["id"])
      .then(res => {
        const url = res["usersDbUrl"]
        const data = { "token": res["token"], "type": "getUsers" }
        return fetcher(url, data)
      })
      .then(res => setUsersData(res["data"]))
      .catch(e => {
        console.error(e)
        alert(e)
      })
  }

  if (!user) return <a href="/auth">LOGIN</a>
  return (
    <div>
      {
        !usersData ?
          <p>getData...</p> :

          usersData.map(x => {
            console.log(x)
            const userId = x["userId"]
            return (
              <div key={userId}>{x["state"]}</div>
            )
          })
      }
    </div>
  )
}