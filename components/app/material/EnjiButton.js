const EnjiButton = ({ children, onClick, type="text" }) => {
  return (
    <button
      className="px-4 py-2 bg-enji text-gray-50 text-lg font-semibold tracking-wide rounded-md"
      onClick={onClick}
      type={type}
    >
      {children}
    </button>
  )
}

export default EnjiButton