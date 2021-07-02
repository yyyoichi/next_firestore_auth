// import { Html } from "next/document"
import Header from "./Header"
import Footer from "./Footer"
const App = (props) => {
  console.log("app^render")
  const userData = props.userData
  return (
    <>
      <div className="flex flex-col min-h-screen font-ui-monospace md:max-w-screen-sm md:mx-auto bg-gray-50">
          <Header userData={userData} />
          <div className="my-12">
            {props.children}
          </div>
          <Footer />
      </div>
    </>
  )
}

export default App