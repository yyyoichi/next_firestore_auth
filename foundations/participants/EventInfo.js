import { memo } from "react"
import Image from "next/image"
import formatDate from "../../components/system/date"
import Link from "next/link"

const EventInfo = memo(
  ({ data }) => {
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
    const cellClass = "flex flex-row my-6 pl-4"
    const iconClass = "pt-4 w-1/6"
    const textBoxClass = "py-2 w-5/6 flex flex-col"
    const textClass = "pt-1"
    return (
      <div className="w-3/4 mx-auto">

        <div className="flex flex-row border-b border-enji pl-4">
          <h2>{eventName}</h2>
          <div className="ml-auto">
            <Link href={page}>
              <a className="bolck" target="new">
                <Image src="/icon/newWindow.png" width={15} height={15} />
              </a>
            </Link>
          </div>
        </div>

        <div className={cellClass}>
          <div className={iconClass}>
            <Image src="/icon/clock.png" width={20} height={20} />
          </div>
          <div className={textBoxClass}>
            <div className={textClass}>{formatDate(start)}</div>
            <div className="pl-5">|</div>
            <div className={textClass}>{formatDate(end)}</div>
          </div>
        </div>

        <div className={cellClass}>
          <div className={iconClass}>
            <Image src="/icon/peple.png" width={20} height={20} />
          </div>
          <div className={textBoxClass}>
            <div className={textClass}>{organizer}</div>
            <div className={textClass}>{email}</div>
          </div>
        </div>

        <div className={cellClass}>
          <div className={iconClass}>
            <Image src="/icon/memo.png" width={20} height={20} />
          </div>
          <div className={textBoxClass}>
            {discriptions.map((x, i) => <div className={textClass} key={i}>{x}</div>)}
          </div>
        </div>
      </div>
    )
  }
  , (prevProps, nextProps) => prevProps.data === nextProps.data
)


export default EventInfo