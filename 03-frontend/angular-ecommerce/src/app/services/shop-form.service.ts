import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {
  private countriesUrl = environment.shopAppUrl+'/countries';
  private statesUrl = environment.shopAppUrl+'/states';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<any[]> {
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(countryCode: string): Observable<any[]> {
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    return this.httpClient.get<GetResponseStates>(searchUrl).pipe(
      map(response => response._embedded.states)
      );
  }

  getCreditCartMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];

    //build an array of months for the dropdown list
    //- starting at the current month and going to 12


    for (let i = startMonth; i <= 12; i++) {
      data.push(i);
    }

    return of(data);

  }

  getCreditCartYears(): Observable<number[]> {
    let data: number[] = [];

    //build an array of years for the dropdown list
    //- starting at the current year and going out 10 years
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for (let i = startYear; i <= endYear; i++) {
      data.push(i);
    }

    return of(data);

  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}