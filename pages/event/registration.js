import { useUser } from "../../firebase/useUser";

export default function Home() {
  let { user, logout } = useUser()
  if (user) {
    return (
      <div className="registration-home">
        <h1>イベントの作成</h1>
        <p>あなたがイベント主催者（以下、主催者）となり、新たにイベントを作成します。</p>
        <h2>アプリ概要</h2>
        <p>当アプリはイベント参加者（以下、参加者）情報と参加者の入退時刻をスプレッドシートに記録します。</p>
        <p>また、参加者情報はイベント主催者が個別で設定し、参加者から収集します。当アプリは設定に従って収集した参加者情報をスプレッドシートに記録します。</p>
        <p>なお、使用するスプレッドシートは主催者自身が手順に従って作成し管理します。</p>
        <h2>イベント作成手順</h2>
        <ol>
          <li>イベント参加者データ用スプレッドシートの作成</li>
          <li>入場ゲート用スプレッドシートの作成</li>
          <li>イベント情報の登録</li>
          <li>イベント参加者情報の収集項目設定</li>
        </ol>
      </div>
    )
  } else return (
    <>
      <a href="/auth">LOGIN</a>
    </>
  )
}