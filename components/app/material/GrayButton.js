const GrayButton = ({ children, onClick }) => {
  return (
    <button
      className="px-4 py-2 bg-gray-600 text-gray-50 text-lg font-semibold tracking-wide rounded-md"
      onClick={onClick}
      disabled={true}
    >
      {children}
    </button>
  )
}

export default GrayButton