import IPermission from './interfaces/IPermission'; // eslint-disable-line
import RoleLookup from '../role/RoleLookup';
import DataHelper from '../../../helpers/DataHelper';

export default class PermissionView {
    public id: string;
    public role: string | RoleLookup;
    public claim: number;

    public constructor(data: IPermission | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.role = DataHelper.handleDataModel(data.role, RoleLookup);
        this.claim = data.claim;
    }

    public static parseArray(list: IPermission[]) {
        return list && Array.isArray(list) ? list.map(item => new PermissionView(item)) : [];
    }
}
