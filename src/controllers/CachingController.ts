import {Service, Inject} from 'typedi'; // eslint-disable-line
import {JsonController, UseBefore, Param, QueryParam, Body, BodyParam, Get, Post, Delete, NotAcceptableError} from 'routing-controllers'; // eslint-disable-line
import ICachingBusiness from '../application/businesses/interfaces/ICachingBusiness';
import CachingBusiness from '../application/businesses/CachingBusiness';
import IUser from '../application/models/user/interfaces/IUser'; // eslint-disable-line

@Service()
@JsonController('/cachings')
@UseBefore((req, res, next) => next((!req.socket.remoteAddress || !req.socket.remoteAddress.includes('127.0.0.1')) && new NotAcceptableError()))
export default class CachingController {
    @Inject(() => CachingBusiness)
    private cachingBusiness: ICachingBusiness;

    @Get('/user-by-token')
    public getUserByToken(@QueryParam('token') token: string) {
        return this.cachingBusiness.getUserByToken(token);
    }

    @Post('/fetch-permission')
    public fetchPermissionCaching() {
        return this.cachingBusiness.fetchPermissionCaching();
    }

    @Post('/check-permission')
    public checkPermission(@BodyParam('role') role: string, @BodyParam('claim') claim: number) {
        return this.cachingBusiness.checkPermission(role, claim);
    }

    @Post('/user')
    public createUser(@Body({required: true}) data: IUser) {
        return this.cachingBusiness.createUser(data);
    }

    @Delete('/user/:id')
    public deleteUser(@Param('id') id: string) {
        return this.cachingBusiness.deleteUser(id);
    }
}
