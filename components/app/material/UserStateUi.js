export const UserStateUiBox = ({ children }) => {
  return (
    <div className="w-3/4 flex justify-center mx-auto">
      {children}
    </div>
  )
}

export const FormHeader = ({titleText, setUserState}) => {
  return (
    <>
      <h3 className="pt-2 px-4 border-b border-enji align-text-bottom mx-auto">{titleText}</h3>
      <p className="text-sm p-2 ml-auto" onClick={() => setUserState("showButton")}>×</p>
    </>
  )
}