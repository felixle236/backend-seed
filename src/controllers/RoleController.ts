import {Service, Inject} from 'typedi'; // eslint-disable-line
import {JsonController, Param, QueryParam, Body, Get, Post, Put, Delete} from 'routing-controllers'; // eslint-disable-line
import IRoleBusiness from '../application/businesses/interfaces/IRoleBusiness';
import RoleBusiness from '../application/businesses/RoleBusiness';

@Service()
@JsonController('/roles')
export default class RoleController {
    @Inject(() => RoleBusiness)
    private roleBusiness: IRoleBusiness;

    @Get('/')
    public find(@QueryParam('keyword') keyword: string, @QueryParam('page') page: number, @QueryParam('limit') limit: number) {
        return this.roleBusiness.find(keyword, page, limit);
    }

    @Get('/:id')
    public get(@Param('id') id: string) {
        return this.roleBusiness.get(id);
    }

    @Get('/role-by-code')
    public getRoleByCode(@QueryParam('code') code: number) {
        return this.roleBusiness.getRoleByCode(code);
    }

    @Post('/')
    public create(@Body({required: true}) data: any) {
        return this.roleBusiness.create(data);
    }

    @Put('/:id')
    public update(@Param('id') id: string, @Body({required: true}) data: any) {
        return this.roleBusiness.update(id, data);
    }

    @Delete('/:id')
    public delete(@Param('id') id: string) {
        return this.roleBusiness.delete(id);
    }
}
