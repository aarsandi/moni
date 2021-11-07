export const leftDaysinMonth = (inputDate) => {
    let date = new Date();
    if(inputDate) {
        const oneDay = 86400000;
        let inputDateGetDate = new Date(inputDate.getTime())
        const diffDays = Math.round(Math.abs((date - inputDateGetDate) / oneDay));
        return diffDays
    }else{
        let time = new Date(date.getTime());
        time.setMonth(date.getMonth() + 1);
        time.setDate(0);
        let days =time.getDate()>date.getDate() ? time.getDate() - date.getDate() : 0;
        return days
    }
}