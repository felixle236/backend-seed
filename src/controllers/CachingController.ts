import {Service, Inject} from 'typedi'; // eslint-disable-line
import {JsonController, Param, QueryParam, Body, BodyParam, Get, Post, Delete} from 'routing-controllers'; // eslint-disable-line
import ICachingBusiness from '../application/businesses/interfaces/ICachingBusiness';
import CachingBusiness from '../application/businesses/CachingBusiness';
import IUser from '../application/models/user/interfaces/IUser'; // eslint-disable-line

@Service()
@JsonController('/cachings')
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
