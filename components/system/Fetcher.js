export const initFetcher = async (url, token) => {
  const body = await JSON.stringify({ 'token': token })
  const option = {
    'method': 'POST',
    'body': body,
    crossDomain: true
  }

  try {
    let res = await fetch(url + "?type=init", option)
    const json = await res.json(res)
    console.log(json)
    return json

  } catch (e) {
    alert("エラーが発生しました。スプレッドシートにアクセスできませんでした。\n" + e)
    return false
  }
}