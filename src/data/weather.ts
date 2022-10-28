
type WeatherResponse = {
	datetimeEpoch: number;
	temp: number;
	windspeed: number;
	winddir: number;
	cloudcover: number
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
	const hourly = json as WeatherResponse[];
	
	const w:Weather[] = [];

	for(let i = 6; i < 20; i++) {
		const d:Weather = {
			time:new Date(hourly[i].datetimeEpoch * 1000),
			temp: hourly[i].temp,
			cloudCover: hourly[i].cloudcover,
			wind: hourly[i].windspeed,
			windDir: hourly[i].winddir,
		}
		w.push(d);
	}

	return  w;
}


export {
	getDayWeather
}