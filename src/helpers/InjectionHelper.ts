export class Context {
    private static containers: {[key: string]: any} = {};

    static get<T>(C): T {
        if (typeof C === 'function') {
            return Context.containers[C.prototype.constructor.name];
        }
        return Context.containers[C];
    }

    static set<T>(C): T {
        let c = new C();
        Context.containers[C.prototype.constructor.name] = c;
        return c;
    }
};

export function injectable(Target): any {
    let target = Context.get(Target);
    if (!target)
        target = Context.set(Target);
    return target;
};

export function inject(Type) {
    return (target, key) => {
        target[key] = Type;
    };
};
