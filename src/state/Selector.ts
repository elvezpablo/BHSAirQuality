import {atom, useAtom} from "jotai";
import { getBuildings, getBuildingData, SensorDataResponse, SensorResponse, SensorsData } from '../services/bhs';
import { SensorData } from '../types';

const buildingsAtom = atom<string[]>([])

const loadBuildingsAtom = atom<string[], string[]>((get) => get(buildingsAtom), (get, set, buildings) => {		
		set(buildingsAtom, buildings)
})

loadBuildingsAtom.onMount = (set) => {
	(async () => {
		const bldgs = await getBuildings();
		set(bldgs);
	})();
}

const selectorAtom = atom<SelectorState>({
	state: "loading",
	building: "",	
	date: new Date()
})

type SelectorState = {
	state: "loading" | "data" | "error",
	building: string,
	date: Date
}

type SelectorParams = {	
	building: string, 
	date: Date
}

const sensorsAtom = atom<SensorsData>({})

const selectorControlAtom = atom<SelectorState,SelectorParams >(
	get => get(selectorAtom),
	async (get, set, {building, date}) => {	
		const selectorData = get(selectorAtom);
		if(building !== selectorData.building) {
			set(selectorAtom, {
				state: "loading",
				building,
				date
			})
			const sensors = await getBuildingData(building);
			console.log(sensors)
			set(sensorsAtom, sensors)
		}		
		set(selectorAtom, {
			state: "data",
			building,
			date
		})
	}
);

selectorControlAtom.onMount = (set) => {
	set({		
		building: "M",	
		date: new Date()
	})
}


export {
	loadBuildingsAtom,
	selectorControlAtom,
	sensorsAtom
}
