import cookies from 'js-cookie'

export const getMyFromCookie = () => {
    const cookie = cookies.get('my')
    if (!cookie) {
        return
    }
    return JSON.parse(cookie)
}

export const setMyCookie = (My) => {
    cookies.set('my', My, {
        //20分に一度
        expires: 20 /60 /24 ,
    })
}

export const removeMyCookie = () => cookies.remove('my')