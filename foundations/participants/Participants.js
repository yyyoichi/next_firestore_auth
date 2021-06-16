import EventInfo from "./EventInfo"
import Apply from "./Apply"

export default function Participants({ data }) {
  console.log(data)
  return (
    <>
      <a href="/auth">LOGIN</a>
      <EventInfo data={data["eventData"]} />
      <Apply data={data["registration"]} />
    </>
  )
}