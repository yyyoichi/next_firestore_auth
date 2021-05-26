import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import firebase from 'firebase/app'
import 'firebase/auth'
import initFirebase from '../firebase/initFirebase'
import {
  removeUserCookie,
  setUserCookie,
  getUserFromCookie,
} from './userCookies'
import { mapUserData } from './mapUserData'

initFirebase()

const useUser = () => {
  const [user, setUser] = useState()
  const router = useRouter()

  const logout = async () => {
    return firebase
      .auth()
      .signOut()
      .then(() => {
        // Sign-out successful.
        router.push('/auth')
      })
      .catch((e) => {
        console.error(e)
      })
  }

  useEffect(() => {
    console.log(`useEffect: ${user}`)
    // Firebase updates the id token every hour, this
    // makes sure the react state and the cookie are
    // both kept up to date
    const cancelAuthListener = firebase.auth().onIdTokenChanged( async (user) => {
      if (user) {
        console.log(true)
        const userData = await mapUserData(user)
        await setUserCookie(userData)
        await setUser(userData)
      } else {
        console.log(false)
        removeUserCookie()
        setUser()
      }
    })

    const userFromCookie = getUserFromCookie()
    if (!userFromCookie) {
      router.push('/')
      return
    }
    setUser(userFromCookie)

    return () => {
      cancelAuthListener()
    }
  }, [])

  return { user, logout }
}

export { useUser }