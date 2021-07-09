// import { Html } from "next/document"
import Header from "./Header"
import Footer from "./Footer"
import { memo } from "react"
const WrapperPc = memo(
  (props) => {
    const userData = props.userData
    const baseClass = "flex flex-col min-h-screen font-ui-monospace bg-gray-50 md:max-w-screen-sm md:mx-auto"

    return (
      <>
        <div className={baseClass}>
          <Header userData={userData} />
          <div className="my-12">
            {props.children}
          </div>
          <Footer />
        </div>
      </>
    )
  }
  , (prevProps, nextProps) => prevProps.userData === nextProps.userData
)

export default WrapperPc