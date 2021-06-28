import formatDate from "../../components/system/date"

export default function EventInfo({ data }) {
  const {
    eventId,
    eventName,
    page,
    organizer,
    email,
    start,
    end,
    discription
  } = data
  const discriptions = discription.split('\n')
  return (
    <>
      <h1>{eventName}</h1>
      <h2>{organizer}</h2>
      {discriptions.map((x,i) => <p key={i}>{x}</p>)}
      <div>
        {formatDate(start) + " ~ " + formatDate(end)}
      </div>
      <div>{"info:" + email}</div>
      <div>{"page:" + page}</div>
    </>
  )
}