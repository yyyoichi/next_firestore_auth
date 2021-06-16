import { fetcher } from "../../../../components/system/Fetcher";
import Participants from "../../../../foundations/participants/Participants";

export default function Page(data) {
  return <Participants data={data}/>
}

export async function getServerSideProps(context) {
  const { eventId, key } = context.params
  const url = process.env.NEXT_PUBLIC_EVENTS_DATABASE_URL
  const token = process.env.NEXT_PUBLIC_GAS_API_KEY
  const type = "getEvent"
  
  const res = await fetcher(url, {token, type, key, eventId})
  console.log(res)
  return {props: res["data"]}
}