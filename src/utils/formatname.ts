export const formatName = (name: string) => {
    let cutName = ''
    if (name.trim().length > 25) {
        cutName = name.slice(0, 20) + '...'
        return cutName
    } else {
        return name
    }
}