import { fetcher } from "../../../../../components/system/Fetcher";
import Users from "../../../../../foundations/organizer/Users";

export default function Page(data) {
  console.log("page")
  return <Users data={data} />
}

export async function getServerSideProps(context) {
  const { eventid, key } = context.params
  const url = process.env.NEXT_PUBLIC_EVENTS_DATABASE_URL
  const token = process.env.NEXT_PUBLIC_GAS_API_KEY
  const type = "getEvent"
  
  const res = await fetcher(url, {token, type, key, eventId: eventid})
  console.log(res)
  return {props: res["data"]}
}