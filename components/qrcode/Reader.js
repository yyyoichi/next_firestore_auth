import { memo } from 'react'
import QrReader from 'react-qr-scanner'

const ReadQr = memo(
  ({ handleScan }) => {
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
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={handleScan}
      />
    )
  },
  // (prevProps, nextProps) => prevProps.open === nextProps.open
)
export default ReadQr