import { Data, DayData } from '../types';


const toDate = (str:string):Date | undefined => {
	const match = str.match(/^([0-9]{2})([0-9]{2})([0-9]{2})/);
	if(!match) {
		return;
	}
	const d = new Date();
	d.setDate(parseInt(match[1]));
	d.setMonth(parseInt(match[2])-1);
	d.setFullYear(parseInt("20"+match[3]));
	d.setHours(6);
	d.setMinutes(0);
	d.setSeconds(0);
	return d;
}

export const getDays = async ():Promise<DayData> => {
	const response = await fetch("./data/files.json") 
	const data = await response.json();	
	const dayData:DayData = {};
	data.forEach((d:string) => {
		const date = toDate(d);
		if(date) {
			dayData[date?.toDateString().substring(0, 11)] = {
				date: date,
				path: "./data/"+d
			}
		}
		
	});
	return dayData;
}

export const getDayData = async (path:string) => {
	const response = await fetch(path) 
	const data = await response.json();	

	return data as Data[];
}