export const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};
/* -------------------------------------------------------------------------- */
export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const getRandomFloat = (min, max) => {
    return Math.random() * (max - min) + min;
};
export const parseProxy = (proxyString) => {
    // Handle different proxy formats:
    // username:password@host:port
    // host:port:username:password
    // host:port
    const cleanProxyString = proxyString.replace(/^https?:\/\//, '');
    let host = '';
    let port = '';
    let username = '';
    let password = '';
    if (cleanProxyString.includes('@')) {
        // username:password@host:port
        const [credentials, hostPort] = cleanProxyString.split('@');
        [username, password] = credentials.split(':');
        [host, port] = hostPort.split(':');
    }
    else {
        const parts = cleanProxyString.split(':');
        if (parts.length === 2)
            // host:port
            [host, port] = parts;
        else if (parts.length === 4)
            // host:port:username:password
            [host, port, username, password] = parts;
    }
    if (!host || !port) {
        throw new Error('Invalid proxy format.');
    }
    return { host, port, username, password };
};
/* -------------------------------------------------------------------------- */
