import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import UserBusiness from '../app/business/UserBusiness';

class BusinessLoader {
    static roleBusiness: IRoleBusiness;
    static userBusiness: IUserBusiness;

    static init() {
        BusinessLoader.roleBusiness = new RoleBusiness();
        BusinessLoader.userBusiness = new UserBusiness();
    }
}

export default BusinessLoader;
