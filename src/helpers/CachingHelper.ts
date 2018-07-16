import * as request from 'request-promise';
import config from '../configuration';

export default class CachingHelper {
    public static get(url): Promise<any> {
        return request({
            method: 'GET',
            uri: `http://${config.HOST}:${config.PORT_CACHING}/api/cachings` + url,
            json: true
        });
    }

    public static post(url, data?: any): Promise<any> {
        return request({
            method: 'POST',
            uri: `http://${config.HOST}:${config.PORT_CACHING}/api/cachings` + url,
            body: data,
            json: true
        });
    }

    public static put(url, data: any): Promise<any> {
        return request({
            method: 'PUT',
            uri: `http://${config.HOST}:${config.PORT_CACHING}/api/cachings` + url,
            body: data,
            json: true
        });
    }

    public static patch(url, data: any): Promise<any> {
        return request({
            method: 'PATCH',
            uri: `http://${config.HOST}:${config.PORT_CACHING}/api/cachings` + url,
            body: data,
            json: true
        });
    }

    public static delete(url): Promise<any> {
        return request({
            method: 'DELETE',
            uri: `http://${config.HOST}:${config.PORT_CACHING}/api/cachings` + url,
            json: true
        });
    }
}
