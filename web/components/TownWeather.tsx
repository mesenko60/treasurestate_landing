import React, { useState, useEffect } from 'react';

type TownWeatherProps = {
  lat: number;
  lng: number;
};

type WeatherData = {
  temperature: number;
  windspeed: number;
  weathercode: number;
};

// Map WMO weather codes to readable conditions and simple emojis
const getWeatherDescription = (code: number) => {
  if (code === 0) return { desc: 'Clear sky', icon: '☀️' };
  if (code === 1 || code === 2 || code === 3) return { desc: 'Partly cloudy', icon: '⛅' };
  if (code === 45 || code === 48) return { desc: 'Fog', icon: '🌫️' };
  if (code >= 51 && code <= 67) return { desc: 'Drizzle / Rain', icon: '🌧️' };
  if (code >= 71 && code <= 77) return { desc: 'Snow', icon: '❄️' };
  if (code >= 80 && code <= 82) return { desc: 'Rain showers', icon: '🌦️' };
  if (code >= 85 && code <= 86) return { desc: 'Snow showers', icon: '🌨️' };
  if (code >= 95) return { desc: 'Thunderstorm', icon: '⛈️' };
  return { desc: 'Unknown', icon: '🌡️' };
};

export default function TownWeather({ lat, lng }: TownWeatherProps) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph`);
        const data = await res.json();
        if (data && data.current_weather) {
          setWeather({
            temperature: data.current_weather.temperature,
            windspeed: data.current_weather.windspeed,
            weathercode: data.current_weather.weathercode,
          });
        }
      } catch (err) {
        console.error('Failed to fetch weather:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchWeather();
  }, [lat, lng]);

  if (loading) return <div style={{ padding: '1rem', background: '#f5f5f5', borderRadius: '8px', marginBottom: '2rem' }}>Loading current weather...</div>;
  if (!weather) return null;

  const condition = getWeatherDescription(weather.weathercode);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '1.5rem', 
      padding: '1.5rem', 
      background: 'white', 
      border: '1px solid #e0e0e0',
      borderRadius: '8px', 
      marginBottom: '2rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <div style={{ fontSize: '3rem', lineHeight: 1 }}>{condition.icon}</div>
      <div>
        <h4 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: '#204051' }}>Current Weather</h4>
        <div style={{ display: 'flex', gap: '1.5rem', color: '#333' }}>
          <span><strong>{Math.round(weather.temperature)}°F</strong></span>
          <span>{condition.desc}</span>
          <span>Wind: {Math.round(weather.windspeed)} mph</span>
        </div>
      </div>
    </div>
  );
}
