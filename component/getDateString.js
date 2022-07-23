
function pad(v){
    return (v<10)?'0'+v:v
  }
  
function getDateString(d){
    d = new Date(d)
    var year = d.getFullYear();
    var month = pad(d.getMonth()+1);
    var day = pad(d.getDate());
    var hour = pad(d.getHours());
    var min = pad(d.getMinutes());
    var sec = pad(d.getSeconds());
    return month+'-'+day+' '+hour+":"+min
    //return year+"-"+month+"-"day+" "+hour+":"+min+":"+sec;
    //YYYYMMDDhhmmss
}

export {getDateString}