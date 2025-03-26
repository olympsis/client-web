import { GROUP_TYPE } from "~/data/Enums";
import { Club } from "~/data/models/ClubModels";
import { Member } from "~/data/models/GenericModels";
import { Organization } from "~/data/models/OrganizationModels";

// Define the Group union type
export type Group = Club | Organization;

// Helper function to determine if a Group is a Club
export function isClub(group: Group): group is Club {
  return group.constructor === Club;
}

// Helper function to determine if a Group is an Organization
export function isOrganization(group: Group): group is Organization {
  return group.constructor === Organization;
}

// Helper function to get GROUP_TYPE enum value from a Group
export function getGroupType(group: Group): GROUP_TYPE {
  return isClub(group) ? GROUP_TYPE.CLUB : GROUP_TYPE.ORGANIZATION;
}

// Helper function to get the group's logo
export function getGroupLogo(group: Group): string | undefined {
    return group.logo;
}

// Helper function to get the group's banner
export function getGroupBanner(group: Group): string | undefined {
    return group.banner;
}

// Helper function to get the group's name
export function getGroupName(group: Group): string | undefined {
  return group.name;
}

// Helper function to get the group's description
export function getGroupDescription(group: Group): string | undefined {
    return group.description;
}

// Helper function to get the group's members
export function getGroupMembers(group: Group): Array<Member> {
    return group.members ?? [];
}

export function getGroupVisibility(group: Group): string {
    if (isClub(group)) {
        const _g = group as Club;
        return _g.visibility ?? 'public';
    } else {
        return 'public';
    }
}

export function getGroupTags(group: Group): string[] {
	if (isClub(group)) {
		return group.tags ?? [];
	} else {
		return [];
	}
}