export default function formatDate(d) {
  const now = new Date(d)
  const yyyy = now.getFullYear()
  const month = now.getMonth()+1
  const day = now.getDate()
  const hour = now.getHours()
  const minute = now.getMinutes()
  return `${yyyy} ${month}/${day} ${hour}:${minute}`
}