import * as request from 'request-promise';
import Project from '../config/Project';
import DataHelper from './DataHelper';

class CachingHelper {
    static get(url): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'GET',
            uri: `http://${Project.HOST}:${Project.PORT_CACHING}/api/caching` + url,
            json: true
        }));
    }

    static post(url, data?: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'POST',
            uri: `http://${Project.HOST}:${Project.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }

    static put(url, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PUT',
            uri: `http://${Project.HOST}:${Project.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }

    static patch(url, data: any): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'PATCH',
            uri: `http://${Project.HOST}:${Project.PORT_CACHING}/api/caching` + url,
            body: data,
            json: true
        }));
    }

    static delete(url): Promise<any> {
        return DataHelper.handlePromiseRequest(request({
            method: 'DELETE',
            uri: `http://${Project.HOST}:${Project.PORT_CACHING}/api/caching` + url,
            json: true
        }));
    }
}

Object.seal(CachingHelper);
export default CachingHelper;
