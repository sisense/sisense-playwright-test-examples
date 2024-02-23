import { ApiVersion as API } from '@constants/restApiVersion';
import { getAuthorizedContext } from '@controllers/restClient';
import { UserContext } from '@config/UserContext';

export class GroupsV09 {
    private static readonly GROUPS = API.V0_9 + '/groups';
    private static readonly GROUPS_BYIDS = this.GROUPS + '/byIds';
    private static readonly GROUPS_ALLDIRECTORIES = this.GROUPS + '/allDirectories';

    static async getGroupsByNameOrId(groupNameOrId: string, userContext: UserContext) {
        const apiContext = await getAuthorizedContext(userContext);
        return apiContext.get(`${this.GROUPS}/${groupNameOrId}`);
    }
}