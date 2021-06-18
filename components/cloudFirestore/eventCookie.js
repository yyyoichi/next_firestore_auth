import cookies from 'js-cookie'

export const getEventFromCookie = () => {
    const cookie = cookies.get('event')
    if (!cookie) {
        return
    }
    return JSON.parse(cookie)
}

export const setEventCookie = (event) => {
    cookies.set('event', event, {
        // firebase id tokens expire in one hour
        // set cookie expiry to match
        expires: 1 / 24,
    })
}

export const removeEventCookie = () => cookies.remove('event')