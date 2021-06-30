import { fetcher } from "./Fetcher"
import { getMyFromCookie, removeMyCookie, setMyCookie } from "./myCookie"

/**
 * gasから自分の情報を取得
 * @param {string} id userId
 * @returns {object} myData
 * @returns {array{}} myData.participant
 * @returns {array{}} myData.organizer
 * 
 */
export const readMyData = async (id) => {
  removeMyCookie()
  const myDataFromCookie = getMyFromCookie()
  if (myDataFromCookie) {
    console.log("cookie!!")
    return myDataFromCookie
  }

  const url = process.env.NEXT_PUBLIC_USER_DATABASE_URL
  const token = process.env.NEXT_PUBLIC_GAS_API_KEY
  const type = "myData"
  const res = await fetcher(url, { token, type, id })
    .catch(e => { throw new Error(e) })

  console.log(res)

  if(res["res"] == "no-data") return "no-data"

  const { organizer, participant } = res["res"]

  /**
   * 
   * @param {Object} object 
   * @param {String} propertyKey 
   * @returns {Array{}}
   */
  const toArray = (object, propertyKey) => {
    const keys = Object.keys(object)
    if (!keys.length) return []
    return keys.reduce((array, x) => {
      const obj = { ...object[x], [propertyKey]: x }
      return [...array, obj]
    }, []);
  }
  
  const myData = {
    organizer: toArray(organizer, "eventId"),
    participant: toArray(participant, "path")
  }

  setMyCookie(myData)
  return myData
}