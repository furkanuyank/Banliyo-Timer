export const convertToDateString = (number) => {
    if (number == null) {
        return null;
    }

    let hour = Math.floor(number / 60);
    let minutes = number - (hour * 60);

    hour / 10 < 1 ? hour = `0${hour}` : hour = hour.toString();
    minutes / 10 < 1 ? minutes = `0${minutes}` : minutes = minutes.toString();
    dateString = `${hour}:${minutes}`;
    return dateString;
}

export const getMomentDateNumber = () => {
    let number = 0;
    const moment = new Date();
    number = moment.getHours() * 60;
    number += moment.getMinutes();
    return number;
}

export const getCurrentTrain = (date, timeData) => {
    if (date > timeData[timeData.length - 1]) {
        return null;
    }
    let i = 0;
    while (timeData[i] < date) {
        i++;
    }
    return timeData[i];
}

export const getNextTrain = (date, timeData) => {
    if (date > timeData[timeData.length - 1]) {
        return null;
    }
    let i = 0;
    while (timeData[i] < date) {
        i++;
    }
    if (timeData[i + 1] == null) {
        return null
    }
    return timeData[i + 1];
}

export const getRemainTime = (date, timeData) => {

    if (getCurrentTrain(date, timeData) == null) {
        return null;
    }
    const remainTime = getCurrentTrain(date, timeData) - date;

    return remainTime;
}