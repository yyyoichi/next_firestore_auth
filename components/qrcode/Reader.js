import { memo } from 'react'
import QrReader from 'react-qr-scanner'

const ReadQr = memo(
  ({ open, handleScan }) => {

    let qrState = open
    const qrIsActive = (bool) => qrState = bool

    const previewStyle = { width: "100%"}
    const delay = 500
    const handleError = err => console.error(err)
    console.log("reanderQRreader")
    // const delay = delayQr ? 500 : false
    return (
      <QrReader
        delay={delay}
        style={previewStyle}
        onError={handleError}
        onScan={(e) => {
          if (!e || !qrState) return//データなし、あるいは読み込み中は処理しない
          qrIsActive(false)
          handleScan(e)
            .finally(() => qrIsActive(true))
        }}
      />
    )
  }
  ,(prevProps, nextProps) => prevProps.open === nextProps.open
)
export default ReadQr