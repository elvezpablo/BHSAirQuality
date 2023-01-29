package main

import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"os"
	"strings"
)

type SensorData struct {
	Data      float64 `json:"data"`
	Mac       int64   `json:"mac"`
	Timestamp int64   `json:"timestamp"`
	Sensor    int32   `json:"type"`
}

var macs = []int64{
	1102833697,
	1102830324,
	1103447808,
	1102833943,
	1102924048,
	1102831445,
	1102921926,
	1102920729,
	1102833817,
	1102923438,
	1102830744,
	1102831804,
	1102923196,
	1102830446,
	1103436253,
	1102922483,
	1102922428,
	1103437357,
	1102921889,
	1102921504,
	1103436705,
	1102921539,
	1103310851,
	1102830744,
	1103437517,
	1102923408,
	1102922997,
	1102922734,
	1103436036,
	1102922983,
	1103435891,
	1103711238,
	1102921284,
	1102923481,
	1103437411,
	1102830712,
	1102832339,
	1103435938,
	1102832475,
	1103310654,
	1102923086,
	1103436273,
	1102831611,
	1102923671,
	1102831748,
	1102831532,
	1102830801,
	1102832959,
	1102830361,
	1102921938,
	1103437429,
	1102921862,
	1102921635,
	1102923449,
	1103442809,
	1102923762,
	1103436415,
	1102830651,
	1102922911,
	1102832383,
	1103310470,
	1102832392,
	1102922608,
	1102920779,
	1102832355,
	1102830344,
	1103436121,
	1102922566,
	1102920741,
	1102830749,
	1102923755,
	1102832265,
	1102833681,
	1102923459,
	1102832044,
	1103436298,
	1102833100,
	1102921387,
	1102830412,
	1102832243,
	1102832311,
	1102923110,
	1102832607,
	1102921780,
	1102922583,
	1103436482,
	1102830572,
	1102922714,
	1102830540,
	1103310918,
	1103310563,
	1102830394,
	1102831973,
	1103435930,
	1102832281,
	1102921932,
	1103436708,
	1102830020,
	1102833875,
	1103310877,
	1102922918,
	1102830602,
	1102830431,
	1103310617,
	1102832942,
	1102923004,
	1103436782,
	1103436062,
	1103436112,
	1102922640,
	1102834163,
	1103310574,
	1102921354,
	1103435949,
	1103436427,
	1103435832,
	1102832737,
	1103437088,
	1102922983,
	1102923839,
	1103436747,
	1102921180,
	1102924251,
	1102830675,
	1103437453,
	1103436305,
	1102922507,
	1102832598,
	1102923028,
	1102921468,
	1102832362,
	1102832745,
	1102832450,
	1102831520,
	1102921342,
	1103436357,
	1103437072,
	1102832448,
	1103437200,
	1102830522,
	1103310686,
	1103442834,
	1103437102,
	1103310631,
	1102921459,
	1102921516,
	1102830505,
	1102921552,
	1102923505,
	1102832414,
	1103437438,
	1102920730,
	1102922533,
	1103437444,
	1102923468,
	1102831775,
	1102830636,
	1102832843,
	1102832783,
	1102830825,
	1102922963,
	1103437179,
	1102832651,
	1103436317,
	1102831551,
	1102922507,
	1102923252,
}

func main() {
	argsWithoutProg := os.Args[1:]

	for i := 0; i < len(argsWithoutProg); i++ {
		fmt.Println("arg ", argsWithoutProg[i])
		fileName := strings.Split(strings.TrimSpace(argsWithoutProg[i]), ".")

		macMap := map[int64]int{}
		for m := 0; m < len(macs); m++ {
			macMap[int64(macs[m])] = m
		}

		content, err := ioutil.ReadFile(argsWithoutProg[i])
		if err != nil {
			log.Fatal("Error when opening file: ", err)
		}

		var sensorData []SensorData
		err = json.Unmarshal(content, &sensorData)
		if err != nil {
			log.Fatal("Error during Unmarshal(): ", err)
		}
		var filtered []SensorData

		// sensorMap := map[int32]string{
		// 	242: "TFAHRENHEIT",
		// 	96:  "VOC",
		// 	181: "CO2",
		// 	248: "RH",
		// }

		fmt.Println("sensors before: ", len(sensorData))
		for j := 0; j < len(sensorData); j++ {
			var sensor = sensorData[j]
			_, isValidMac := macMap[sensor.Mac]
			// _, isValidSensor := sensorMap[sensor.Sensor]
			isValidCO2Data := true
			if sensor.Sensor == 181 && sensor.Data >= 5000 {
				isValidCO2Data = false
			}
			if isValidMac && isValidCO2Data {
				var s = SensorData{Mac: sensor.Mac, Timestamp: sensor.Timestamp, Sensor: sensor.Sensor, Data: math.Round(sensor.Data)}
				filtered = append(filtered, s)

			}
			if sensor.Sensor == 181 && sensor.Data >= 5000 {
				fmt.Println(sensor)
			}

		}
		fmt.Println("sensors after: ", len(filtered))

		outputFile, err := os.Create("./" + fileName[0] + ".csv")
		if err != nil {
			log.Fatal("Error during file creation: ", err)
		}
		defer outputFile.Close()

		writer := csv.NewWriter(outputFile)
		defer writer.Flush()

		for _, r := range filtered {
			var csvRow []string
			csvRow = append(csvRow, fmt.Sprint(r.Data), fmt.Sprint(r.Mac), fmt.Sprint(r.Timestamp), fmt.Sprint(r.Sensor))
			if err := writer.Write(csvRow); err != nil {
				log.Fatal("could not add row")
			}
		}
	}
}
