// import { Html } from "next/document"
import Header from "./Header"
import Footer from "./Footer"
const App = (props) => {
  // console.log("app^render")
  const userData = props.userData
  const type = props["type"] || "sp"
  // console.log(type)
  const baseClass = "flex flex-col min-h-screen font-ui-monospace bg-gray-50"
  const wrapClass =
    type === "sp" ? baseClass + " md:max-w-screen-sm md:mx-auto" :baseClass
      

  return (
    <>
      <div className={wrapClass}>
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