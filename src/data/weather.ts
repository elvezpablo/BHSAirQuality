
type WeatherResponse = {
	hourly: {
		time: string[],
		temperature_2m: number[],
		cloudcover: number[],
		windspeed_10m: number[]
		winddirection_10m: number[]
,	}
}

export type Weather = {
	time: Date,
	temp: number,
	wind: number,
	windDir: number,
	cloudCover: number
}



const getDayWeather = async (path: string) => {
	const response = await fetch(path.replace("CO2", "weather"));
	const json = await response.json();
	const {hourly} = json as WeatherResponse;

	const w:Weather[] = [];

	for(let i = 6; i < 20; i++) {
		const d:Weather = {
			time:new Date(hourly.time[i]),
			temp: hourly.temperature_2m[i],
			cloudCover: hourly.cloudcover[i],
			wind: hourly.windspeed_10m[i],
			windDir: hourly.winddirection_10m[i],
		}
		w.push(d);
	}

	return  w;
}


export {
	getDayWeather
}