import { GROUP_ROLE, GROUP_TYPE } from "../Enums";
import { ChangeRoleRequest, type Member } from "../models/GenericModels";
import { ClubService } from "../services/ClubService";
import { OrganizationService } from "../services/OrganizationService";

export class GroupManager {
    private session = useSessionStore();
    private clubService = new ClubService();
    private orgService = new OrganizationService();

    constructor() {}

    async changeMemberRank(member: Member, role: GROUP_ROLE): Promise<boolean> { 
        const selectedGroup = this.session.selectedGroup?.club ?? this.session.selectedGroup?.organization;
        if (!selectedGroup) return false;

        const isInGroup = selectedGroup.members?.find((m) => m.id == member.id);
        if (!isInGroup) return false;

        const request = new ChangeRoleRequest(role.valueOf());
        switch (this.session.selectedGroup?.type) {
            case GROUP_TYPE.ORGANIZATION:
                const hasChd = this.orgService.changeMemberRank(selectedGroup.id ?? '', member.id ?? '', request);
                if (!hasChd) return false;
                break;
            default:
                const hasChanged = this.clubService.changeMemberRank(selectedGroup.id ?? '', member.id ?? '', request);
                if (!hasChanged) return false;
                break;
        }

        return true;
    }

    async kickMember(member: Member): Promise<boolean> { 
        const selectedGroup = this.session.selectedGroup?.club ?? this.session.selectedGroup?.organization;
        if (!selectedGroup) return false;

        switch (this.session.selectedGroup?.type) {
            case GROUP_TYPE.ORGANIZATION:
                const hasK = this.orgService.kickMember(selectedGroup.id ?? '', member.id);
                if (!hasK) return false;
                break;
            default:
                const hasKicked = this.clubService.kickMember(selectedGroup.id ?? '', member.id);
                if (!hasKicked) return false;
                break;
        }

        return true;
    }

    async reportMember(member: Member, report: any): Promise<boolean> { 
        const selectedGroup = this.session.selectedGroup?.club ?? this.session.selectedGroup?.organization;
        if (!selectedGroup) return false;

        return false;
    }

    async leaveGroup(): Promise<boolean> { 
        const selectedGroup = this.session.selectedGroup?.club ?? this.session.selectedGroup?.organization;
        if (!selectedGroup) return false;

        switch (this.session.selectedGroup?.type) {
            case GROUP_TYPE.ORGANIZATION:
                const left = this.orgService.leaveOrganization(selectedGroup.id!);
                if (!left) return false;
                break;
            default:
                const hasLeft = this.clubService.leaveClub(selectedGroup.id!)
                if (!hasLeft) return false;
                break;
        }

        return true;
    }
}