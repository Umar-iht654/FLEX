

#-----------------------------------------opencage convert area to geolocations--------------------------------------

import requests
apiKey="5177f41a694a4a10bd7db683866c7640"#using group email
address=("L697ZX Brownlow Hill Liverpool")#address user will enter
url=f"https://api.opencagedata.com/geocode/v1/json?q={address}&key={apiKey}"

response1 = requests.get(url)

if(response1.status_code == 200):#if the fetch worked correctly

  data=response1.json()
  lat=data['results'][0]['geometry']['lat']
  lon = data['results'][0]['geometry']['lng']
  print("lat=",lat)#displays latitude and longitude,doesn't need to be displayed
  print("lon=", lon)
else:
  print("error",response1.status_code)#output error
print()
#------------------------------------find local amenities within the area---------------------------------------------------------

url2="https://api.foursquare.com/v3/places/search"
apiKey2="fsq3Xp9MV8U6C4teXNl4xgCQIOlMgoYBXECyr3WYxCihwsI="#using group email
parameters2={
  'query':'parks',#local parks in the area
  'll':f'{lat},{lon}',
  'radius':'10000',
  'limit':'15',
}

auth={'authorization':apiKey2}

response2 = requests.get(url2,params=parameters2,headers=auth);

if(response2.status_code == 200):#if the fetch has worked

  data2=response2.json()

  for a in data2['results']:#output local parks in the area
      if(a['categories'][0]['name']=='Park'):
          print(a['name'])
else:
  print("error",response2.status_code)#if not,print error


#---------------------------------------display the weather within the area-------------------------------------------------------------

apiKey2='21e0e952188c9da791bc5a2ce37c1b83'#api key using group email
lat2=lat
lon2=lon
link2=f'https://api.openweathermap.org/data/2.5/forecast?lat=53.51765&lon=-2.21443&appid={apiKey2}'

response2=requests.get(link2)
print()
if(response2.status_code==200):

    data2=response2.json()
    weatherDetails=data2['list']
    # print(weatherDetails)
    count=0#to control indexing
    for i in weatherDetails:#for each timeframe output weather
        count+=1
        temp=i['main']['temp']#temperature
        description=i['weather'][0]['main']#description,cloudy,rainy etc
        time=i['dt_txt']#time
        temp-=273.15#convert kelvin to celcius
        temp=round(temp)
        print(f'{time} {temp}°C  {description}')#output values

        if count==7:#only output for the next 21 hours-displays every 3 hours
          break


else:
    print("error")
    print(response2.status_code)

