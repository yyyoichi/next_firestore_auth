import initFirebase from '../../firebase/initFirebase'
import { useEffect, useState } from 'react'
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth'
import firebase from 'firebase/app'
import 'firebase/auth'
import { setUserCookie } from '../../firebase/userCookies'
import { mapUserData } from '../../firebase/mapUserData'
// import ReadUserDataFromCloudFirestore from '../cloudFirestore/Read'

initFirebase() // initialize firebase

const firebaseAuthConfig = {
    signInFlow: 'popup',
    // Auth providers
    // https://github.com/firebase/firebaseui-web#configure-oauth-providers
    signInOptions: [
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: false,
        },
        // add additional auth flows below
    ],
    signInSuccessUrl: '/',
    credentialHelper: 'none',
    callbacks: {
        signInSuccessWithAuthResult: async ({ user }, redirectUrl) => {
            console.log('sign in classback')
            const userData = await mapUserData(user);
            setUserCookie(userData);
        },
    },
}

const FirebaseAuth = () => {
    // Do not SSR FirebaseUI, because it is not supported.
    // https://github.com/firebase/firebaseui-web/issues/213
    const [renderAuth, setRenderAuth] = useState(false)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setRenderAuth(true)
        }
    }, [])
    return (
        <div>
            {renderAuth ? (
                <StyledFirebaseAuth
                    uiConfig={firebaseAuthConfig}
                    firebaseAuth={firebase.auth()}
                />
            ) : null}
        </div>
    )
}

export default FirebaseAuth