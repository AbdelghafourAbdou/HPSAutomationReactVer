export const toProper = (title) => {
    let tempArr = title.split('');
    let capitalFirstLetter = tempArr[0].toUpperCase();
    let newTitle = tempArr.toSpliced(0, 1, capitalFirstLetter).join('');
    return newTitle;
}