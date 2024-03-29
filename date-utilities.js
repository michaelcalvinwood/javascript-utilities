// get today's date in yyyy-mm-dd format
const todayAsISO = () => {
    let yourDate = new Date();
    const offset = yourDate.getTimezoneOffset();
    yourDate = new Date(yourDate.getTime() - (offset*60*1000));
    return yourDate.toISOString().split('T')[0];
}

const currentTimeInMilitaryTime = () => {
	return new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: false })
}

const convertISODateToHumanReadable = isoDate => {
    const options = {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    };
    const formattedDate = new Date(isoDate);
    return formattedDate.toLocaleDateString('en-us', options);
}

const todaysLocalDateAsYyyyMmDd = () => {
    let yourDate = new Date()
    const offset = yourDate.getTimezoneOffset()
    yourDate = new Date(yourDate.getTime() - (offset*60*1000))
    return yourDate.toISOString().split('T')[0]
}

const secondsToHHMMSS = seconds => {
    if (seconds >= 3600) return new Date(seconds * 1000).toISOString().slice(11, 19);
    return  new Date(seconds * 1000).toISOString().slice(14, 19);
}

/* Luxon Utilities */


let date = luxon.DateTime.fromISO(post.date_gmt).minus({hours: 5}).toFormat('yyyy-MM-dd HH:mm:ss');
let prettyDate = luxon.DateTime.fromISO(post.date_gmt).minus({hours: 5}).toFormat('MMMM dd, yyyy')