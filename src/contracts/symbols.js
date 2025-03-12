export const getRandomSymbol = () => {
    const length = Math.floor(Math.random() * 2) + 4;
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomCharCode = Math.floor(Math.random() * 26) + 65;
        result += String.fromCharCode(randomCharCode);
    }
    return result;
};
