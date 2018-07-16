import {Service} from 'typedi'; // eslint-disable-line
import BaseRepository from './base/BaseRepository';
import PermissionSchema from '../schemas/PermissionSchema';
import IPermission from '../models/permission/interfaces/IPermission'; // eslint-disable-line

@Service()
export default class PermissionRepository extends BaseRepository<IPermission> {
    public constructor() {
        super(PermissionSchema);
    }
}
