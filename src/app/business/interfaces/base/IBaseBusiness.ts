import IRead from '../common/IRead';
import IWrite from '../common/IWrite';

interface IBaseBusiness<T> extends IRead<T>, IWrite<T>
{

}

export default IBaseBusiness;
