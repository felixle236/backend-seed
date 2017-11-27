import {sealed} from '../helpers/InjectionHelper'; // eslint-disable-line

@sealed
class Claim {
    static FULL_ACCESS: string = 'FULL ACCESS';
    static ACCESS_PAGE_ADMIN: string = 'ACCESS PAGE ADMIN';
}

export default Claim;
