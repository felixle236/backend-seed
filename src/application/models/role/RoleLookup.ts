import IRole from './interfaces/IRole'; // eslint-disable-line

export default class RoleLookup {
    public id: string;
    public code: number;
    public name: string;
    public level: number;

    public constructor(data: IRole | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.level = data.level;
    }

    public static parseArray(list: IRole[]) {
        return list && Array.isArray(list) ? list.map(item => new RoleLookup(item)) : [];
    }
}
