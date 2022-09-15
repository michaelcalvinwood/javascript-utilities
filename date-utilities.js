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
