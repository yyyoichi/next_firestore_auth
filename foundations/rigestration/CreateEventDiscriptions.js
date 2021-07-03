export default function CreateEventDiscriptions() {
  const headerClass = "border-b border-enji pl-4"
  const boxClass = "my-5"
  const textClass = "py-2 px-2"
  const olClass = "list-decimal list-inside py-2 "
  const ulClass = "list-disc list-inside pl-2 pt-1"
  return (
    <div className="w-3/4 mx-auto">
      <div className={boxClass}>
        <h2 className={headerClass}>イベントの作成</h2>
        <p className={textClass}>あなたがイベント主催者（以下、主催者）となり、新たにイベントを作成します。</p>
        <p className={textClass}>イベントの作成には、PCが必要です。</p>
      </div>
      <div className={boxClass}>
        <h2 className={headerClass}>アプリ概要</h2>
        <p className={textClass}>当アプリはイベント参加者（以下、参加者）情報と参加者の入退時刻を「入退ゲート用スプレッドシート」に記録します。記録されたデータは、毎日指定した時間に入退ゲート用スプレッドシートから別途移行・保存されます。</p>
        <p className={textClass}>また、イベント開催に際し必要な参加者情報は、イベント主催者が設定し参加者から収集します。当アプリは設定に従って収集した参加者情報を「参加者データ用スプレッドシート」に記録します。</p>
        <p className={textClass}>なお、使用するすべてのスプレッドシート（Googleスプレッドシート）は主催者自身が手順に従って作成し管理します。そのため主催者はGoogleアカウントが必要となります。</p>
      </div>
      <div className={boxClass}>
        <h2 className={headerClass}>イベント作成手順（イベント登録手順概要）</h2>
        <ol className={textClass}>
          <li className={olClass}>イベント情報登録</li>
          <li className={olClass}>参加者情報登録
            <ul>
              <li className={ulClass}>参加者データ用スプレッドシートの作成・ウェブアプリURLの発行</li>
            </ul>
          </li>
          <li className={olClass}>入退ゲート情報登録
            <ul>
              <li className={ulClass}>入場ゲート用スプレッドシートの作成・ウェブアプリURLの発行</li>
            </ul>
          </li>
        </ol>
      </div>
    </div>
  )
}