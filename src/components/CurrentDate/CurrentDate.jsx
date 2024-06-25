 export default getCurrentDate =(separator='') =>{

    let newDate = new Date()
    let date_raw = newDate.getDate();
    let month_raw = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    var date, month
      
    if (date_raw<10)  {  date ="0"+date_raw.toString()} else {  date =date_raw.toString()}
    if (month_raw<10)  {  month ="0"+month_raw.toString()} else {  month =month_raw.toString()}
    
    return (
        <div>{year}{separator}{month}{separator}{date}</div>
                );
    }