/**
 * 
 * @param {String} url 
 * @param {String} token 
 * @returns 
 */
export const initFetcher = async (url, token) => {
  const type = 'init'
  const data = { token, type }
  const res = await fetcher(url, data)
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
  console.log(data)
  const body = await JSON.stringify(data)
  const options = {
    'method': 'POST',
    'body': body,
    crossDomain: true,
    redirect: 'follow'
  }

  try {
    let res = await fetch(url, options)
    const json = await res.json(res)
    // console.log(json)
    if (json["status"] === "reject") {
      console.error("reject!!")
      throw new Error("アクセスが拒否されました。")
    } else if (json["status"] === "failture") {
      console.log(json)
      throw new Error("プログラム実行中にエラーが発生しました。\n" + json["failture"])
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
 * @param {Object} d 
 * @returns 
 */
export const setupAllGate = async ({ folderId, sheetId }, d) => {
  const { gatesUrl } = d
  return await Promise.all(
    gatesUrl.map(async gate => {
      const { gateName, gateUrl } = gate
      const data = { folderId, sheetId, gateName, ...d }
      return await fetcher(gateUrl, data)
    })
  )
}