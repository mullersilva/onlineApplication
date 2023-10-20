import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(
    private httpClient: HttpClient
  ) { }

  private API_KEY = '87f116dcb5271368bf86bfdf58dc185a';

  searchWeatherMap(city: string) {
    return this.httpClient.get<any>(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.API_KEY}`);
  }
}
