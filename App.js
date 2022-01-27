import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet,Dimensions, Text, View, ScrollView } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Ionicons } from '@expo/vector-icons';
import { Fontisto } from '@expo/vector-icons';

const {width:SCRREN_WIDTH} = Dimensions.get("window");
const API_KEY = "8261be241988baef1b35585fa119851a"; //서버가 없기 때문에 임의적으로 api key를 앱 내에 저장
const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle:"rain",
  Thunderstorm:"lightning",
}

export default function App() {
  const [region, setRegion] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude},
      {useGoogleMaps:false}
    );
    setRegion(location[0].region);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await response.json();
    setDays(json.daily);
  }
  useEffect(() => {
    getWeather();
  }, []);
  
  return (
  <View style={styles.container}>
    <View style={styles.city}>
      <Text style={styles.cityName}>{region}</Text>
    </View>
    <ScrollView pagingEnabled horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
      {days.length == 0 ? (
        <View style={styles.day}>
          <ActivityIndicator 
            color="black" 
            size="large"
          />
        </View>
      ) : (
        days.map((day, index) => 
        <View key={index} style={styles.day}>
          <View style={{
            flexDirection: "row", 
            alignItems:"center", 
    
            justifyContent:"space-between"
            }}
          >
            <Text style={styles.temperature}>{parseFloat(day.temp.day).toFixed(1)}</Text>
            <Fontisto name={icons[day.weather[0].main]} size={68} color="white" />
          </View>
          <Text style={styles.description}>{day.weather[0].main}</Text>
          <Text style={styles.tinyText}>{day.weather[0].description}</Text>        
        </View>
        ) 
      )}
    </ScrollView>
  </View>
  );
  
}

const styles = StyleSheet.create({
  container:{
    flex : 1, backgroundColor: "coral"
  },
  city:{
    flex : 1.2,
    backgroundColor:"coral",
    justifyContent: "center",
    alignItems: "center"
  },
  cityName:{
    color:Colors.white,
    fontSize: 63,
    fontWeight: "600",
  },
  weather:{
    
  },
  day:{
    width: SCRREN_WIDTH,
    alignItems:"center",
  },
  temperature : {
    color:Colors.white,
    marginTop:50,
    fontSize: 178,
  },
  description:{
    color:Colors.white,
    marginTop: -30,
    fontSize: 60,
  },
  tinyText: {
    color:Colors.white,
    fontSize: 20,
  }

})
