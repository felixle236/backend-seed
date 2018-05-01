import ICachingBusiness from '../app/business/interfaces/ICachingBusiness';
import CachingBusiness from '../app/business/CachingBusiness';
import RoleBusiness from '../app/business/RoleBusiness';
import IRoleBusiness from '../app/business/interfaces/IRoleBusiness';
import IUserBusiness from '../app/business/interfaces/IUserBusiness';
import UserBusiness from '../app/business/UserBusiness';

class BusinessLoader {
    static cachingBusiness: ICachingBusiness;
    static roleBusiness: IRoleBusiness;
    static userBusiness: IUserBusiness;

    static init() {
        BusinessLoader.cachingBusiness = new CachingBusiness();
        BusinessLoader.roleBusiness = new RoleBusiness();
        BusinessLoader.userBusiness = new UserBusiness();
    }
}

export default BusinessLoader;
