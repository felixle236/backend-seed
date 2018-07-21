import IPermission from './interfaces/IPermission'; // eslint-disable-line
import RoleLookup from '../role/RoleLookup';
import DataHelper from '../../../helpers/DataHelper';

export default class PermissionView {
    id: string;
    role: string | RoleLookup;
    claim: number;

    constructor(data: IPermission | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.role = DataHelper.handleDataModel(data.role, RoleLookup);
        this.claim = data.claim;
    }

    static parseArray(list: IPermission[]): PermissionView[] {
        return list && Array.isArray(list) ? list.map(item => new PermissionView(item)) : [];
    }
}
