import IRole from './interfaces/IRole'; // eslint-disable-line

export default class RoleView {
    id: string;
    code: number;
    name: string;
    level: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(data: IRole | undefined) {
        if (!data)
            return;

        this.id = data.id;
        this.code = data.code;
        this.name = data.name;
        this.level = data.level;
        this.createdAt = data.createdAt;
        this.updatedAt = data.updatedAt;
    }

    static parseArray(list: IRole[]): RoleView[] {
        return list && Array.isArray(list) ? list.map(item => new RoleView(item)) : [];
    }
}
