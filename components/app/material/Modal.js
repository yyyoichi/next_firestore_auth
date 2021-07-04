const Modal = ({ children, modalType = "white" }) => {
  const color = modalType === "white" ? "bg-gray-50"
    : modalType === "gray" ? "bg-gray-400"
      : modalType === "blue" ? "bg-blue-400"
        : "bg-enji"
  const className = "absolute bg-opacity-75 top-0 w-full h-full z-100 " + color
  return (
    <div className={className}>
      <div className="flex flex-col h-full md:flex md:flex-row">
        {children}
      </div>
    </div>
  )
}

export default Modal