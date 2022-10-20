
type Schedule = {
	[s:string ] : {h:number, m: number}
}

const regular:Schedule = {
	"0": {h: 7,m: 26},
	"1": {h: 8,m: 30},
	"2": {h: 9,m: 34},
	"3": {h: 10,m: 43},
	"lunch": {h: 11,m: 41},
	"4": {h: 12,m: 27},
	"5": {h: 1,m: 29},
	"6": {h: 2,m: 33},
	"7": {h: 3,m: 37}
}

const monday:Schedule = {
	"staff_mtg": {h: 8,m: 3},
	"1": {h: 10,m: 43},
	"2": {h: 10,m: 49},
	"3": {h: 11,m: 43},
	"lunch": {h: 12,m: 26},
	"4": {h: 1,m: 12},
	"5": {h: 2,m: 1},
	"6": {h: 2,m: 50},
	"7": {h: 3,m: 39}
}

export default function scheduleForDay(day:number) {
	const d = new Date(day);
	const schedule = d.getDay() === 1 ? monday : regular;
	const out: { [s: string]: number} = {};

	Object.keys(schedule).forEach(period => {
		d.setHours(schedule[period].h)
		d.setMinutes(schedule[period].m)		
		out[period] = d.getTime();
	})

	return out;
}