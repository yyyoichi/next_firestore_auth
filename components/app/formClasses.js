

export default function formClasses(type = "sp") {
  const blockClass = "my-4"
  const headerClass = "border-b border-enji pl-4"
  const boxClass = type === "sp" ? "my-4 px-2" : "my-4 px-2 md:mx-20 md:my-10"
  const labelClass = "py-2"
  const discClass = "block text-xs text-gray-500"
  const inputClass = "w-full border my-2"
  const buttonClass= "px-3 border-2 rounded-md ml-4"
  return { blockClass, headerClass, boxClass, labelClass, discClass, inputClass, buttonClass }
}