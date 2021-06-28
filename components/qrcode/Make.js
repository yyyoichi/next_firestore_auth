import QRCode from "qrcode.react"
import { memo, useEffect, useState } from "react";

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
        <div className="qr-box">
          <QRCode className="qrcode" value={qr} size={300} />
        </div>
        <button className="update-qr" onClick={updataQr} >更新</button>
      </>
    )
  }
,(prevProps, nextProps) => prevProps.id === nextProps.id
)

export default MakeQr