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
    public find(@QueryParam('keyword') keyword: string, @QueryParam('page') page: number, @QueryParam('limit') limit: number) {
        return this.userBusiness.find(keyword, page, limit);
    }

    @Get('/:id')
    @Authorized(UserClaim.GET)
    public get(@Param("id") id: string) {
        return this.userBusiness.get(id);
    }

    @Get('/profile')
    @Authorized()
    public getProfile(@CurrentUser({required: true}) currentUser: IUser) {
        return this.userBusiness.getProfile(currentUser.id);
    }

    @Post('/authenticate')
    public authenticate(@Body({required: true}) data: any) {
        return this.userBusiness.authenticate(data.email, data.password);
    }

    @Post('/signup')
    public signup(@Body({required: true}) data: any) {
        return this.userBusiness.signup(data);
    }

    @Put('/:id')
    @Authorized(UserClaim.UPDATE)
    public update(@Param("id") id: string, @Body({required: true}) data: any) {
        return this.userBusiness.update(id, data);
    }

    @Put('/profile')
    @Authorized()
    public updateProfile(@CurrentUser({required: true}) currentUser: IUser, @Body({required: true}) data: any) {
        return this.userBusiness.update(currentUser.id, data);
    }

    @Patch('/password')
    @Authorized()
    public updatePassword(@CurrentUser({required: true}) currentUser: IUser, @Body({required: true}) data: any) {
        return this.userBusiness.updatePassword(currentUser.id, data.password, data.newPassword);
    }

    @Delete("/:id")
    @Authorized(UserClaim.DELETE)
    public delete(@Param("id") id: string) {
        return this.userBusiness.delete(id);
    }
}
