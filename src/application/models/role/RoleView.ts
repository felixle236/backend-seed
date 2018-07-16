import IRole from './interfaces/IRole'; // eslint-disable-line

export default class RoleView {
    public id: string;
    public code: number;
    public name: string;
    public level: number;
    public createdAt: Date;
    public updatedAt: Date;

    public constructor(data: IRole | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.level = data.level;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    public static parseArray(list: IRole[]) {
        return list && Array.isArray(list) ? list.map(item => new RoleView(item)) : [];
    }
}
