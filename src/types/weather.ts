export interface Weather {
  location: string;         
  condition: string;   
  temperature: number; 
  feelsLike: number;   
  windSpeed: number;  
  iconUrl?: string;
}