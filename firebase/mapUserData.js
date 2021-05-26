import ReadUserDataFromCloudFirestore from "../components/cloudFirestore/Read";

export const  mapUserData = async (user) => {
  const { user_name, belong, profile, follows } = await ReadUserDataFromCloudFirestore(user);
  const { uid, email, xa } = user;
  return {
    uid,
    email,
    belong,
    follows,
    profile,
    token: xa,
    name: user_name,
  }
}
//  default mapUserData;