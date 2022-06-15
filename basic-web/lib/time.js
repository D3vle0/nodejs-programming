exports.current_time = () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = ('0' + (today.getMonth() + 1)).slice(-2);
	const day = ('0' + today.getDate()).slice(-2);
	const dateString = year + '-' + month + '-' + day;
	const hours = ('0' + today.getHours()).slice(-2);
	const minutes = ('0' + today.getMinutes()).slice(-2);
	const seconds = ('0' + today.getSeconds()).slice(-2);
	const timeString = hours + ':' + minutes + ':' + seconds;
	const time = dateString + ' ' + timeString;

	return time;
}