import firebase from 'firebase/app'
import 'firebase/firestore'
import { mapUserData } from '../../firebase/mapUserData'
import { useUser } from '../../firebase/useUser'
// import Button from 'react-bootstrap/Button'

const ReadUserDataFromCloudFirestore = (user) => {
  console.log('readUserData')
  const { uid, email } = user;
  return new Promise(resolve => {
    try {
      const doc = firebase
        .firestore()
        .collection('myCollection')
        .doc(uid).get();

      if (!doc.exists) {
        console.log('not Exists!');
        const initData = {
          user_name: "",
          email,
          belong: "",
          follows: [],
          profile: "",
          time_stamp: new Date(),
        }
        // userDoc.set(initData).catch(e => alert(e));
        resolve(initData)
      }
      resolve(doc.data());
      // alert('Data was successfully fetched from cloud firestore! Close this alert and check console for output.')
    } catch (error) {
      console.log(error)
      alert(error)
    }
  })

}

export default ReadUserDataFromCloudFirestore;