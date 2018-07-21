import IRole from './interfaces/IRole'; // eslint-disable-line

export default class RoleLookup {
    id: string;
    code: number;
    name: string;
    level: number;

    constructor(data: IRole | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.level = data.level;
    }

    static parseArray(list: IRole[]): RoleLookup[] {
        return list && Array.isArray(list) ? list.map(item => new RoleLookup(item)) : [];
    }
}
