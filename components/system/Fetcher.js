/**
 * 
 * @param {String} url 
 * @param {String} token 
 * @returns 
 */
export const initFetcher = async (url, token) => {
  const type = 'init'
  const data = {token, type}
  const res = await fetcher( url, data)
  console.log(res)
  return res;
}



/**
 * 
 * @param {String} url 
 * @param {Object} data 
 * @param {String} data.token
 * @param {String} data.type
 * @returns 
 */
export const fetcher = async (url, data) => {
  const body = await JSON.stringify(data)
  const options = {
    'method': 'POST',
    'body': body,
    crossDomain: true
  }

  try {
    let res = await fetch(url , options)
    const json = await res.json(res)
    // console.log(json)
    if(json["status"] !== "ok"){
      throw new Error("アクセスが拒否されました。")
    }
    return json

  } catch (e) {
    throw new Error("エラーが発生しました。データにアクセスできませんでした。\n" + e)
  }
}

/**
 * 記録用フォルダIDを渡してゲート用ウェブアプリをセットアップ
 * @param {String} res.folderId
 * @param {String} res.sheetId 
 * @param {String} token 
 * @param {Array} gatesUrl 
 * @returns 
 */
export const setupAllGate  = async ({folderId, sheetId, resetTime}, token, gatesUrl) => {
  const type = "setup"
  return await Promise.all(
    gatesUrl.map( async url => {
      const data = { token, type, folderId, sheetId, resetTime}
      return await fetcher(url, data)
    })
  )
} 