import firebase from 'firebase/app'
import 'firebase/firestore'
import { useUser } from '../../firebase/useUser'

export default async function createEvent({ id, eventId, usersDbUrl, gatesUrl, eventName, token, key }) {
  console.log("eventId:" + eventId)
  console.log("id:" +id)
  try {
    await firebase.firestore()
      .collection("testUsers")
      .doc(id)
      .collection("events")
      .doc(eventId)
      .set({ usersDbUrl, gatesUrl, eventName, token, key })
      // .then(res => { return res })
      // .catch(e => { return new Error(e) })
    return key
  } catch (e) {
    console.log("ERROR!")
    return new Error(e)
  }
}