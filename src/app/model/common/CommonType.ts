export enum ClusterRequestType {
    LoadAllData = 1,
    UpdateRole
};
Object.seal(ClusterRequestType);

export enum GenderType {
    Male,
    Female
};
Object.seal(GenderType);

export enum LoginProvider {
    Local,
    Google,
    Facebook
};
Object.seal(LoginProvider);
