import {Service, Inject} from 'typedi'; // eslint-disable-line
import {JsonController, Authorized, Param, QueryParam, Body, Get, Post, Put, Delete} from 'routing-controllers'; // eslint-disable-line
import IRoleBusiness from '../application/businesses/interfaces/IRoleBusiness';
import RoleBusiness from '../application/businesses/RoleBusiness';
import RoleClaim from '../resources/permissions/RoleClaim'; // eslint-disable-line

@Service()
@JsonController('/roles')
export default class RoleController {
    @Inject(() => RoleBusiness)
    private roleBusiness: IRoleBusiness;

    @Get('/')
    @Authorized(RoleClaim.GET)
    find(@QueryParam('keyword') keyword: string, @QueryParam('page') page: number, @QueryParam('limit') limit: number) {
        return this.roleBusiness.find(keyword, page, limit);
    }

    @Get('/lookup')
    @Authorized(RoleClaim.GET)
    lookup(@QueryParam('keyword') keyword: string, @QueryParam('page') page: number, @QueryParam('limit') limit: number) {
        return this.roleBusiness.lookup(keyword, page, limit);
    }

    @Get('/:id')
    @Authorized(RoleClaim.GET)
    get(@Param('id') id: string) {
        return this.roleBusiness.get(id);
    }

    @Get('/role-by-code')
    @Authorized(RoleClaim.GET)
    getRoleByCode(@QueryParam('code') code: number) {
        return this.roleBusiness.getRoleByCode(code);
    }

    @Post('/')
    @Authorized(RoleClaim.CREATE)
    create(@Body({required: true}) data: any) {
        return this.roleBusiness.create(data);
    }

    @Put('/:id')
    @Authorized(RoleClaim.UPDATE)
    update(@Param('id') id: string, @Body({required: true}) data: any) {
        return this.roleBusiness.update(id, data);
    }

    @Delete('/:id')
    @Authorized(RoleClaim.DELETE)
    delete(@Param('id') id: string) {
        return this.roleBusiness.delete(id);
    }
}
