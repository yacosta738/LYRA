import Routes from "../routes.client";
import type {ResponseData} from "@lyra/shared";
import SecureFetchFactory from "~/repository/secure.factory";
import type {OrganizationTeamMember} from "~/domain/organization";

class TeamMemberModule extends SecureFetchFactory {
  private readonly RESOURCE = Routes.TeamMember;

  async fetchAll() {
    return this.call<ResponseData<OrganizationTeamMember>>(
      {
        method: 'GET', url: `${this.RESOURCE.FetchAll()}`, fetchOptions: {
          headers: {
            ...(this.accessToken ? {
              'Authorization': `Bearer ${this.accessToken}`
            } : {})
          },
        }
      }
    )
  }
}

export default TeamMemberModule;