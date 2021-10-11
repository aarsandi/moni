export const leftDaysinMonth = (inputDate) => {
    let date = new Date();
    let time = new Date(date.getTime());
    time.setMonth(date.getMonth() + 1);
    time.setDate(0);
    if(inputDate) {
        let inputDateGetDate = new Date(inputDate.getTime())
        inputDateGetDate.setMonth(inputDateGetDate.getMonth() + 1);        
        let days =inputDateGetDate>date ? (time.getDate()-date.getDate())+inputDateGetDate.getDate() : 0;
        return days
    }else{
        let days =time.getDate()>date.getDate() ? time.getDate() - date.getDate() : 0;
        return days
    }
}