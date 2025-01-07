import { getAuth } from 'firebase/auth';
import { Venue, VenuesResponse } from '../models/VenueModels';
import { Courrier, Method, Endpoint, Scheme } from 'malakbel';
import { AdministrativeArea, Country, SubAdministrativeArea } from '../models/GenericModels';

export class LocaleService {

    private http: Courrier;

    constructor() {
        const url = process.env.API ?? '';
        this.http = new Courrier(Scheme.HTTPS, url);
    }

    async getCountries(): Promise<Array<Country> | undefined> {
        let query = new Map<string, string>()

        const endpoint = new Endpoint("/v1/locales/countries", query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (body) {
            let countries: Array<Country> = [];
            let data: { [key: string]: any } = body;
            data.forEach((element: { [x: string]: string; })  => {
                let c = new Country(
                    element['id'],
                    element['name']
                )
                countries.push(c);
            });
            return countries;
        } else {
            return undefined;
        }
    }

    async getAdministrativeAreas(id: string) : Promise<Array<AdministrativeArea> | undefined> {
        let query = new Map<string, string>()

        const endpoint = new Endpoint(`/v1/locales/countries/${id}/administrativeAreas`, query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (body) {
            let areas: Array<AdministrativeArea> = [];
            let data: { [key: string]: any } = body;
            data.forEach((element: { [x: string]: string; })  => {
                let a = new AdministrativeArea(
                    element['id'],
                    element['name'],
                    element['code'],
                    element['country_id']
                )
                areas.push(a);
            });
            return areas;
        } else {
            return undefined;
        }
    }

    async getSubAdministrativeAreas(id: string) : Promise<Array<SubAdministrativeArea> | undefined> {
        let query = new Map<string, string>()

        const endpoint = new Endpoint(`/v1/locales/administrativeAreas/${id}/subAdministrativeAreas`, query)

        const [status, _headers, body] = await this.http.request(Method.GET, endpoint, undefined, undefined);

        if (body) {
            let areas: Array<SubAdministrativeArea> = [];
            let data: { [key: string]: any } = body;
            data.forEach((element: { [x: string]: string; })  => {
                let a = new SubAdministrativeArea(
                    element['id'],
                    element['name'],
                    element['admin_area_id']
                );
                areas.push(a);
            });
            return areas;
        } else {
            return undefined;
        }
    }
}

