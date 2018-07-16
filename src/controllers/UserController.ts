import {Service, Inject} from 'typedi'; // eslint-disable-line
import {JsonController, Authorized, CurrentUser, Param, QueryParam, Body, Get, Post, Put, Patch, Delete} from 'routing-controllers'; // eslint-disable-line
import IUserBusiness from '../application/businesses/interfaces/IUserBusiness';
import UserBusiness from '../application/businesses/UserBusiness';
import IUser from '../application/models/user/interfaces/IUser'; // eslint-disable-line
import UserClaim from '../resources/permissions/UserClaim'; // eslint-disable-line

@Service()
@JsonController('/users')
export default class UserController {
    @Inject(() => UserBusiness)
    private userBusiness: IUserBusiness;

    @Get('/')
    @Authorized(UserClaim.GET)
    public find(@CurrentUser({required: true}) currentUser: IUser, @QueryParam('keyword') keyword: string, @QueryParam('page') page: number, @QueryParam('limit') limit: number) {
        return this.userBusiness.find(keyword, page, limit);
    }

    @Get('/:id')
    public get(@Param("id") id: string) {
        return this.userBusiness.get(id);
    }

    @Post('/authenticate')
    public authenticate(@Body({required: true}) data: any) {
        return this.userBusiness.authenticate(data.email, data.password);
    }

    @Post('/signup')
    public signup(@Body({required: true}) data: any) {
        return this.userBusiness.signup(data);
    }

    // @Put('/')
    // public updateProfile(@Body({required: true}) data: any) {
    //     return this.userBusiness.updateProfile(id, data);
    // }

    @Put('/:id')
    public update(@Param("id") id: string, @Body({required: true}) data: any) {
        return this.userBusiness.update(id, data);
    }

    @Patch('/password')
    public updatePassword(@Param('id') id: string, @Body({required: true}) data: any) {
        return this.userBusiness.updatePassword(id, data.password, data.newPassword);
    }

    @Patch('/:id/role')
    public updateRole(@Param('id') id: string, @Body({required: true}) data: any) {
        return this.userBusiness.updateRole(id, data.role);
    }

    @Delete("/:id")
    public delete(@Param("id") id: string) {
        return this.userBusiness.delete(id);
    }
}
