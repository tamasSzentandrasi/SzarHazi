import random
import json
import sys
import numpy as np
import time

def strTimeProp(start, end, format, prop):
    """Get a time at a proportion of a range of two formatted times.

    start and end should be strings specifying times formated in the
    given format (strftime-style), giving an interval [start, end].
    prop specifies how a proportion of the interval to be taken after
    start.  The returned time will be in the specified format.
    """

    stime = time.mktime(time.strptime(start, format))
    etime = time.mktime(time.strptime(end, format))

    ptime = stime + prop * (etime - stime)

    return time.strftime(format, time.localtime(ptime))


def randomDate(start, end, prop):
    return strTimeProp(start, end, '%m/%d/%Y %I:%M %p', prop)

'''print randomDate("1/1/2008 1:30 PM", "1/1/2009 4:50 AM", random.random())
'''
class SzarWorldGenerator():
	def __init__(self, cities, cityNames, countryNames, hotelNames, hotelTypes, hotelsInCityRange, connectivity, density,
		cartypes, carsizes, carprices, hotelSizeRange, hotelStarPriceDict):
			self.Cities = cities
			self.CityNames = cityNames
			self.CountryNames = countryNames
			self.Connectivity = connectivity
			self.Density = density
			self.Cartypes = cartypes
			self.CarSizeDict = carsizes
			self.CarPrices = carprices
			self.HotelNames = hotelNames
			self.HotelTypes = hotelTypes
			self.HotelsInCityRange = hotelsInCityRange
			self.HotelSizeRange = hotelSizeRange
			self.HotelStarPriceDict = hotelStarPriceDict
    
	def generateJSON(self, path):
		pathres = path + "cars.json"
		open(pathres, 'w').close()
		numberGenerated = 0
		NcarCityDict = {}
		ArrayCarCityDict = {}
		WcarCityDict = {}
		WcarTypesDict = {}
		for city in self.CityNames:
			selectedAmount = np.random.randint(self.HotelsInCityRange[0]*4, self.HotelsInCityRange[1]*8+1)
			NcarCityDict.update({city: selectedAmount})
			numberGenerated = numberGenerated + selectedAmount
		for city, carNum in NcarCityDict.items():
			ArrayCarCityDict.update({city: []})
			carList =  list(range(1, numberGenerated + 1))
			counter  = carNum + 1
			while counter > 0:
				idToInsert = np.random.choice(carList)
				carList.remove(idToInsert)
				carCityList = ArrayCarCityDict.get(city)
				carCityList.append(idToInsert)
				ArrayCarCityDict.update({city:carCityList})
				WcarCityDict.update({idToInsert:city})
				WcarTypesDict.update({idToInsert: np.random.choice(self.Cartypes)})
				counter = counter - 1
		with open(pathres,'w') as file: 
			file.write("[\n")
			idCounter = 1
			startList = True
			for car in carList:
				if (self.CarPrices.get(WcarTypesDict.get(car))):
					if not startList:
						file.write(",\n\t{\n")
					else:
						file.write("\t{\n")
						startList = False
					file.write("\t\t\"id\" : " + str(car) + ",\n")			
					file.write("\t\t\"type\" : \"" + str(WcarTypesDict.get(car)) + "\",\n")
					file.write("\t\t\"size\" : \"" + str(self.CarSizeDict.get(WcarTypesDict.get(car))) + "\",\n")
					file.write("\t\t\"price\" : " + str(int(self.CarPrices.get(WcarTypesDict.get(car)) * (np.random.random() + 0.5))) + "\n\t}")
		pathres = path + "hotels.json"
		open(pathres, 'w').close()
		numberGenerated = 0
		NhotelCityDict = {}
		WhotelCityDict = {}
		WcityHotelDict = {}
		HotelStarDict = {}
		for city in self.CityNames:
			selectedAmount = np.random.randint(self.HotelsInCityRange[0], self.HotelsInCityRange[1]+1)
			NhotelCityDict.update({city: selectedAmount})
			numberGenerated = numberGenerated + selectedAmount
		for city, hotelNum in NhotelCityDict.items():
			WhotelCityDict.update({city: []})
			hotelList =  list(range(1, numberGenerated + 1))
			counter  = hotelNum + 1
			while counter > 0:
				idToInsert = np.random.choice(hotelList)
				hotelList.remove(idToInsert)
				cityHotelList = WhotelCityDict.get(city)
				cityHotelList.append(idToInsert)
				WhotelCityDict.update({city:cityHotelList})
				WcityHotelDict.update({idToInsert:city})
				HotelStarDict.update({idToInsert: np.random.randint(1,6)})
				counter = counter - 1
		with open(pathres,'w') as file: 
			file.write("[\n")
			idCounter = 1
			startList = True
			for hotel, city in WcityHotelDict.items():
				if not startList:
					file.write(",\n\t{\n")
				else:
					file.write("\t{\n")
					startList = False
				file.write("\t\t\"id\" : " + str(hotel) + ",\n")
				includesCityNameRAND = np.random.random()
				includesCityName = False
				if includesCityNameRAND > np.random.random():
					includesCityName = True
				chosenHotel = np.random.choice(self.HotelNames)
				chosenType = np.random.choice(self.HotelTypes)
				if includesCityName:
					file.write("\t\t\"name\" : \"" + str(WcityHotelDict.get(hotel)) + " " + str(chosenHotel) + " " + str(chosenType) + "\",\n")
				else:
					file.write("\t\t\"name\" : \""  + str(chosenHotel) + " " + str(chosenType) + "\",\n")
				numberOfRooms = np.random.randint(self.HotelSizeRange[0], self.HotelSizeRange[1])
				roomCounter = numberOfRooms + 1
				startList2 = True
				file.write("\t\t\"rooms\" : [\n")
				while roomCounter > 0:
					if startList2:
						file.write("\t\t\t{\n")
						startList2 = False
					else:
						file.write(",\n\t\t\t{\n")
					roomSize = np.random.randint(1,6)
					priceRange = np.random.random() + 0.5
					file.write("\t\t\t\t\"size\" : " + str(roomSize) + ",\n")
					file.write("\t\t\t\t\"price\" : " + str(int(priceRange * roomSize * self.HotelStarPriceDict.get(HotelStarDict.get(hotel)))) + "\n\t\t\t}")
					roomCounter = roomCounter - 1
				file.write("\n\t\t]\n")
				file.write("\t}")
				idCounter = idCounter + 1
		pathres = path + "cities.json"
		open(pathres, 'w').close()  
		addedCities = []
		addedCountries = []
		WcityCountryDict ={}
		with open(pathres,'w') as file: 
			cityCounter = self.Cities
			file.write("[\n")
			idCounter = 1
			remainingCities = self.CityNames[:]		
			startList = True
			addedCities = []
			addedCountries = []
			for city in self.CityNames:
				if not startList:
					file.write(",\n\t{\n")
				else:
					file.write("\t{\n")
					startList = False
				file.write("\t\t\"id\" : " + str(idCounter) + ",\n")
				idCounter = idCounter + 1
				chosenCity = np.random.choice(remainingCities)
				remainingCities.remove(chosenCity)
				addedCities.append(chosenCity)
				file.write("\t\t\"name\" : \"" + str(chosenCity) + "\",\n")
				chosenCountry = np.random.choice(self.CountryNames)
				addedCountries.append(chosenCountry)
				WcityCountryDict.update({chosenCity : chosenCountry})
				file.write("\t\t\"country\" : \"" + str(chosenCountry) + "\",\n")
				file.write("\t\t\"hotels\" : [")
				startList2 = True
				for hotelId in WhotelCityDict.get(city):
					if not startList2:
						file.write(",")
					else:
						startList2 = False
					file.write(str(hotelId))
				file.write("],\n")
				file.write("\t\t\"cars\" : [")
				startList2 = True
				for carId in ArrayCarCityDict.get(city):
					if not startList2:
						file.write(",")
					else:
						startList2 = False
					file.write(str(carId))
				file.write("]\n\t}\n]")
		squareSize = int(np.sqrt(len(addedCountries))) + 1
		for city in addedCities:
			country_x = addedCountries.index(WcityCountryDict.get(city)) % squareSize
			country_y = int(addedCountries.index(WcityCountryDict.get(city)) / squareSize)
			x = np.random.randint(1,100)
			y = np.random.randint(1,100)				
		pathres = path + "routes.json"
		open(pathres, 'w').close()  
		with open(pathres,'w') as file: 
			file.write("[\n")
			idCounter = 1
			startList = True
			workingWith = self.CityNames[:]
			routes = {}
			Nroutes = {}
			startDates = {}
			intervals = {}
			for city in workingWith:
				for cityTwo in workingWith:
					if (str(city) != str(cityTwo)):
						data = []
						key = str(city) + str(cityTwo)
						Nroutes.update({key:data})
			count = (self.Cities * self.Connectivity)* self.Connectivity
			while count > 0:
				if not len(workingWith) < 3:	
					cityOne = np.random.choice(workingWith)
					workingWith.remove(cityOne)
					cityTwo = np.random.choice(workingWith)
					data = []
					key = str(city) + str(cityTwo)
					asd = []
					asd = Nroutes.get(key)
					startStart = True
					if len(asd) < self.Connectivity:
						if (startStart):
							startStart = False
						else:
							file.write(",\n")
						asd.append(idCounter)
						startTime = randomDate("1/1/2017 1:30 PM", "12/31/2017 4:50 AM", random.random())
						levelnum = np.random.randint(1,3)
						rownum = np.random.randint(20, 101)
						colnum = np.random.randint(4,11)
						initial_free_space = levelnum*rownum*colnum
						price = int((1/(np.random.randint(4,8) * levelnum * rownum * colnum))*400000)
						Nroutes.update({key: asd})
						routes.update({idCounter : [city, cityTwo]})
						file.write("\t{\n")
						file.write("\t\t\"id\" : " + str(idCounter) + ",\n")
						file.write("\t\t\"from\" : " + str(city) + ",\n")
						file.write("\t\t\"to\" : " + str(cityTwo) + ",\n")
						file.write("\t\t\"date\" : " + str(startTime) + ",\n")
						file.write("\t\t\"freespace\" : " + str(initial_free_space) + ",\n")
						file.write("\t\t\"seats\" : [\n")
						idCounter = idCounter + 1
						level_counter = levelnum
						startList = True
						while level_counter > -1:
							if (startList):
								startList = False
								file.write("\t\t[")
							else:
								file.write(",\n\t\t[")
							row_counter = rownum
							startList2 = True
							while row_counter > -1:
								if (startList2):
									file.write("\n\t\t\t\t[")
									startList2 = False
								else:
									file.write(",\n\t\t\t\t[")
								col_counter = colnum
								startList3 = True
								while col_counter > -1:
									if (startList3):
										startList3 = False
									else:
										file.write(",")
									file.write(str(0))
									col_counter = col_counter -1
								file.write("]")
								row_counter = row_counter - 1
							file.write("\n\t\t]")
							level_counter = level_counter -1
						file.write("\n\t\t],\n\t\t\"price\" : " + str(price) + "\n\t}")
						count = count - 1
				else:
					break
			file.write("\n]")