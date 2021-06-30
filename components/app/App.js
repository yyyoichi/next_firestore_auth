// import { Html } from "next/document"
import Header from "./Header"
import Footer from "./Footer"
const App = (props) => {
  const userData = props.userData
  return (
    <>
      <div className="flex flex-col min-h-screen font-ui-monospace md:max-w-screen-sm md:mx-auto">
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