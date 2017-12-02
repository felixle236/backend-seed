import Role from '../app/model/role/Role';
import BusinessLoader from '../system/BusinessLoader';
import {ClusterRequestType} from '../app/model/common/CommonType';

class DataLoader {
    private static isUseCluster: boolean = false;
    static roles: Role[] = [];

    static initMasterEvent(cluster) {
        cluster.on('message', async (worker, msg: {type: ClusterRequestType}, handle) => {
            if (msg.type === ClusterRequestType.LoadAllData) {
                DataLoader.pushDataToWorker(worker, msg.type, {
                    roles: DataLoader.roles
                });
            }
            else if (msg.type === ClusterRequestType.UpdateRole) {
                DataLoader.roles = await BusinessLoader.roleBusiness.getAll();
                DataLoader.pushDataToAllWorkers(cluster, msg.type, DataLoader.roles);
            }
        });
    }

    static initWorkerEvent() {
        DataLoader.isUseCluster = true;

        process.on('message', (msg: {type: ClusterRequestType, data: any}) => {
            if (msg.type === ClusterRequestType.LoadAllData) {
                DataLoader.roles = msg.data && msg.data.roles;
            }
            else if (msg.type === ClusterRequestType.UpdateRole)
                DataLoader.roles = msg.data;
        });

        (<any>process).send({type: ClusterRequestType.LoadAllData});
    }

    static pushDataToAllWorkers(cluster, type, data) {
        for (let key in cluster.workers) {
            if (cluster.workers.hasOwnProperty(key)) {
                let worker = cluster.workers[key];
                DataLoader.pushDataToWorker(worker, type, data);
            }
        }
    }

    static pushDataToWorker(worker, type, data) {
        worker.send({type: type, data: data});
    }

    // Using by master or normal, only called from server.ts file
    static async loadAll(): Promise<void> {
        DataLoader.roles = await BusinessLoader.roleBusiness.getAll();

        // console.log('Load global Data ===> Done.');
    }

    // Using by workers or normal
    static async loadRoles(): Promise<void> {
        if (DataLoader.isUseCluster)
            (<any>process).send({type: ClusterRequestType.UpdateRole});
        else
            DataLoader.roles = await BusinessLoader.roleBusiness.getAll();

        // console.log('The roles data loading has finished.');
    }
}

Object.seal(DataLoader);
export default DataLoader;
