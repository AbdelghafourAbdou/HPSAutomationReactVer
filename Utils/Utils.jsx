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