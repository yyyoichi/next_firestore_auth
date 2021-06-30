import QRCode from "qrcode.react"
import { memo, useEffect, useState } from "react";
import Image from "next/image"

const MakeQr = memo(
  ({ id }) => {
    const getNow = () => {
      const now = + new Date().getTime();
      return id + "_timer_" + now;
    };

    const [qr, setQr] = useState(getNow());
    const updataQr = () => setQr(getNow())

    useEffect(() => {
      const interval = setInterval(() => updataQr, 10 * 60 * 1000);
      return () => clearInterval(interval);
    }, [])

    return (
      <>
        <QRCode className="mx-auto my-5" value={qr} size={250} />
        <div className="flex flex-row my-10 justify-center">
          <div onClick={updataQr}>
            <Image src="/icon/reload.png" width={13} height={13} />
          </div>
          <div className="pl-2"  onClick={updataQr}>更新</div>
        </div>
      </>
    )
  }
  , (prevProps, nextProps) => prevProps.id === nextProps.id
)

export default MakeQr