export interface Weather {
  location: string;
  condition: string;
  temperature: number;
  feelsLike: number;
  recentRain: number;
  windSpeed: number;
  iconUrl?: string;
}

export default async function fetchIslambadWeather(): Promise<Weather> {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=33.6844&longitude=73.0479&current_weather=true`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Error in fetching the Weather of Islamabad");
  }

  const data = await res.json();

  const weatherCodeMap: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly sunny",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
  };

  const weather = data.current_weather;

  return {
    location: "Islamabad",
    condition: weatherCodeMap[weather.weathercode] || "Unknown",
    temperature: Math.round(weather.temperature),
    feelsLike: Math.round(weather.temperature + 3), 
    windSpeed: Math.round(weather.windspeed),
    iconUrl: `/icons/${weather.weathercode}.png`,
  };
}
