import ICachingBusiness from './interfaces/ICachingBusiness'; // eslint-disable-line
import RoleBusiness from './RoleBusiness';
import CachingAccess from '../dataAccess/CachingAccess';
import Role from '../model/role/Role';
import UserAuthentication from '../model/user/UserAuthentication'; // eslint-disable-line

class CachingBusiness implements ICachingBusiness {
    private static _instance: ICachingBusiness;
    private roleRepository: any;
    private userRepository: any;

    private constructor() {
        this.roleRepository = CachingAccess.db.roles;
        this.userRepository = CachingAccess.db.users;
    }

    static get instance() {
        if (!CachingBusiness._instance)
            CachingBusiness._instance = new CachingBusiness();
        return CachingBusiness._instance;
    }

    fetchDataRole(): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            let roles = await RoleBusiness.instance.getAll();

            this.deleteRoles().then(() => {
                this.roleRepository.insert(roles, (error, result) => {
                    if (error) {
                        console.log('CachingBusiness.fetchDataRole.1\n', error);
                        return resolve(false);
                    }
                    console.log('\x1b[32m', '\nFetch data role caching done\n', '\x1b[0m');
                    resolve(true);
                });
            }).catch(error => {
                console.log('CachingBusiness.fetchDataRole.2\n', error);
                resolve(false);
            });
        });
    }

    getRoles(): Promise<Role[]> {
        return new Promise<Role[]>((resolve, reject) => {
            this.roleRepository.find({}).sort({level: 1}).exec((err, doc) => {
                if (err) {
                    console.log('CachingBusiness.getRoles\n', err);
                    return resolve([]);
                }
                resolve(doc ? Role.parseArray(doc) : []);
            });
        });
    }

    getRole(_id: string): Promise<Role | undefined> {
        return new Promise<Role | undefined>((resolve, reject) => {
            if (!_id)
                return resolve();

            this.roleRepository.findOne({_id}, (err, doc) => {
                if (err) {
                    console.log('CachingBusiness.getRole\n', err);
                    return resolve();
                }
                resolve(doc && new Role(doc));
            });
        });
    }

    getRolesByIds(ids: string[]): Promise<Role[]> {
        return new Promise<Role[]>((resolve, reject) => {
            if (!ids || !ids.length)
                return resolve([]);

            let query = {
                _id: {
                    $in: ids
                }
            };
            this.roleRepository.find(query).sort({level: 1}).exec((err, doc) => {
                if (err) {
                    console.log('CachingBusiness.getRolesByIds\n', err);
                    return resolve([]);
                }
                resolve(doc ? Role.parseArray(doc) : []);
            });
        });
    }

    getRoleByCode(code: number): Promise<Role | undefined> {
        return new Promise<Role | undefined>((resolve, reject) => {
            if (!code)
                return resolve();

            this.roleRepository.findOne({code}, (err, doc) => {
                if (err) {
                    console.log('CachingBusiness.getRoleByCode\n', err);
                    return resolve();
                }
                resolve(doc && new Role(doc));
            });
        });
    }

    getUserAuthenticationByToken(token: string): Promise<UserAuthentication | undefined> {
        return new Promise<UserAuthentication | undefined>((resolve, reject) => {
            if (!token)
                return resolve();

            this.userRepository.findOne({
                'token.accessToken': token,
                'token.tokenExpire': {
                    $gt: new Date()
                }
            }, async (err, doc) => {
                if (err) {
                    console.log('CachingBusiness.getUserAuthenticationByToken\n', err);
                    return resolve();
                }
                if (doc)
                    delete doc.cachedAt;
                return resolve(doc);
            });
        });
    }

    createRole(data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            let roleCreate = new Role(data);
            if (!roleCreate || !roleCreate._id || !roleCreate.code || !roleCreate.name)
                return resolve(false);

            this.roleRepository.findOne({_id: roleCreate._id}, async (err, doc) => {
                if (err) {
                    console.log('CachingBusiness.createRole.1\n', err);
                    return resolve(false);
                }

                if (doc)
                    await this.deleteRole(doc._id);

                this.roleRepository.insert(roleCreate, (err, result) => {
                    if (err) {
                        console.log('CachingBusiness.createRole.2\n', err);
                        return resolve(false);
                    }
                    resolve(true);
                });
            });
        });
    }

    createUserAuthentication(data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!data || !data._id)
                return resolve(false);

            this.userRepository.findOne({_id: data._id}, async (err, doc) => {
                if (err) {
                    console.log('CachingBusiness.createUserAuthentication.1\n', err);
                    return resolve(false);
                }

                if (doc) {
                    data.cachedAt = doc.cachedAt;
                    await this.updateUserAuthentication(data._id, data);

                    delete data.cachedAt;
                    return resolve(true);
                }
                else {
                    data.cachedAt = new Date();
                    this.userRepository.insert(data, (err, result) => {
                        if (err) {
                            console.log('CachingBusiness.createUserAuthentication.2\n', err);
                            return resolve(false);
                        }
                        delete data.cachedAt;
                        return resolve(true);
                    });
                }
            });
        });
    }

    private updateUserAuthentication(_id: string, data: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!_id || !data)
                return resolve(false);

            this.userRepository.update({_id}, data, (err, numReplaced) => {
                if (err) {
                    console.log('CachingBusiness.updateUserAuthentication\n', err);
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }

    deleteRole(_id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!_id)
                return resolve(false);

            this.roleRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err) {
                    console.log('CachingBusiness.deleteRole\n', err);
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }

    deleteRoles(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.roleRepository.remove({}, {multi: true}, (err, numRemoved) => {
                if (err) {
                    console.log('CachingBusiness.deleteRoles\n', err);
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }

    deleteUserAuthentication(_id: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (!_id)
                return resolve(false);

            this.userRepository.remove({_id}, {}, (err, numRemoved) => {
                if (err) {
                    console.log('CachingBusiness.deleteUserAuthentication\n', err);
                    return resolve(false);
                }
                resolve(true);
            });
        });
    }
}

export default CachingBusiness;
