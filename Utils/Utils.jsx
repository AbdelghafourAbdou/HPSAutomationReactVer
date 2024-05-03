import CryptoES from 'crypto-es';
export const toProper = (title) => {
    let tempArr = title.split('');
    let capitalFirstLetter = tempArr[0].toUpperCase();
    let newTitle = tempArr.toSpliced(0, 1, capitalFirstLetter).join('');
    return newTitle;
}

export const toProperMultipleWords = (title) => {
    let copiedTitle = title.split(' ');
    let moddedTitles = copiedTitle.map(word => toProper(word));
    return moddedTitles.join(' ');
}

export const getFormattedCurrentDateTime = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${month}${day}${hours}${minutes}${seconds}`;
}

export const getFormattedCurrentDate = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is zero-based
    const day = String(now.getDate()).padStart(2, '0');

    return `${month}${day}`;
}

export const getFormattedCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${hours}${minutes}${seconds}`;
}

export const generateSixRandomNumbers = () => {
    let concatenatedNumbers = '';
    for (let i = 0; i < 6; i++) {
        const randomNum = Math.floor(Math.random() * 10); // Generates random number between 0 and 9
        concatenatedNumbers += randomNum;
    }
    return concatenatedNumbers;
}

export const generateElevenNumbers = () => {
    let concatenatedNumbers = '';
    for (let i = 0; i < 11; i++) {
        const randomNum = Math.floor(Math.random() * 10); // Generates random number between 0 and 9
        concatenatedNumbers += randomNum;
    }
    return concatenatedNumbers;
}

export const getJulianFormattedDate = () => {
    const now = new Date();
    const years = String(now.getFullYear());
    const startOfYear = new Date(now.getFullYear(), 0, 0);
    const diff = now - startOfYear;
    const oneDay = 1000 * 60 * 60 * 24;
    const lastYearChar = years[years.length - 1];
    const daysSinceStartOfYear = String(Math.floor(diff / oneDay)).padStart(3, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    return `${lastYearChar}${daysSinceStartOfYear}${hours}`;
}

export const generateConsequentNumber = () => {
    let latestNumber = localStorage.getItem('caseId');
    if (latestNumber === null) {
        localStorage.setItem('caseId', 1);
        latestNumber = 1;
    } else {
        latestNumber = Number(latestNumber);
        localStorage.setItem('caseId', latestNumber + 1);
    }
    let numberString = String(latestNumber).padStart(5, '0');
    return `P${numberString}`;
}

function parseBigInt(str, base = 10) {
    base = BigInt(base);
    let bigint = BigInt(0);
    for (let i = 0; i < str.length; i++) {
        let code = str[str.length - 1 - i].charCodeAt(0) - 48;
        if (code >= 10) code -= 39;
        bigint += base ** BigInt(i) * BigInt(code);
    }
    return bigint;
}

const convertHexatoBinary = (num) => {
    return parseInt(num, 16).toString(2);
}
const convertBinarytoHexa = (num) => {
    return parseBigInt(num, 2).toString(16).toUpperCase();
}

// eslint-disable-next-line react-refresh/only-export-components
const XOR = (bin1, bin2) => {
    let XORed = [];
    if (bin1.length === bin2.length) {
        for (let i = 0; i < bin1.length; i++) {
            if (bin1[i] === bin2[i]) {
                XORed.push('0');
            } else {
                XORed.push('1');
            }
        }
    }
    return XORed.join('');
}

export const generatePINBlock = (PIN, PAN) => {
    const PINBlock1 = `04${PIN}FFFFFFFFFF`;
    const PINBlock2 = `0000${String(PAN).slice(3, 15)}`;
    let PINBlockRes = [];
    for (let i = 0; i < PINBlock1.length; i++) {
        let bin1 = convertHexatoBinary(PINBlock1[i]).padStart(5, '0');
        let bin2 = convertHexatoBinary(PINBlock2[i]).padStart(5, '0');
        let binRes = XOR(bin1, bin2);
        let hexRes = convertBinarytoHexa(binRes);
        PINBlockRes.push(hexRes);
    }

    PINBlockRes = PINBlockRes.join('');
    let hexKey = "A2C837F71073D63E804AFB3154AB579B";

    // Convert hex key and data to word array needed for CryptoES
    const keyWordArray = CryptoES.enc.Hex.parse(hexKey);
    const dataWordArray = CryptoES.enc.Hex.parse(PINBlockRes);
    // Encrypt data using 3DES
    const encrypted = CryptoES.TripleDES.encrypt(dataWordArray, keyWordArray, {
        mode: CryptoES.mode.ECB,
        padding: CryptoES.pad.NoPadding
    });
    // Convert the encrypted data back to a hex string
    const encryptedHex = encrypted.ciphertext.toString(CryptoES.enc.Hex).toUpperCase();
    return encryptedHex;
}