import { Data, DayData } from '../types';


const getPacificOffset = (date:Date) => {

	// suppose the date is 12:00 UTC
	var invdate = new Date(date.toLocaleString('en-US', {
	  timeZone: "America/Los_Angeles"
	}));
  
	// then invdate will be 07:00 in Toronto
	// and the diff is 5 hours
	var diff = date.getTime() - invdate.getTime();
  
	// so 12:00 in Toronto is 17:00 UTC
	return date.getTime() - diff; // needs to substract
  
  }

const toDate = (str:string):Date | undefined => {
	const match = str.match(/^([0-9]{2})([0-9]{2})([0-9]{2})/);
	if(!match) {
		return;
	}
	const d = new Date();
	d.setFullYear(parseInt("20"+match[3]));
	d.setMonth(parseInt(match[2])-1);
	d.setDate(parseInt(match[1]));	
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