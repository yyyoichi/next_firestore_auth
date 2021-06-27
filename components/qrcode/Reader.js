import { memo } from 'react'
import QrReader from 'react-qr-scanner'

const ReadQr = memo(
  ({ handleScan, open }) => {
    const previewStyle = {
      height: 240,
      width: 320,
    }
    const delay = 700
    const handleError = err => {
      console.error(err)
    }
    // console.log("reanderQRreader")
    // const delay = delayQr ? 500 : false
    return (
      <div className="qr-reader">
        {!open ? <></> :
          <QrReader
            delay={delay}
            style={previewStyle}
            onError={handleError}
            onScan={handleScan}
          />
        }
      </div>
    )
  },
  // (prevProps, nextProps) => prevProps.open === nextProps.open
)
export default ReadQr