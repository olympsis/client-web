<template>
    <li id="member-list-item">
        <div id="user-info">
            <UserIcon :user="member.user" :size="3"/>
            <div id="info">
                <a class="name">{{ member.user?.username ?? 'olympsis-user' }}</a>
                <div 
                    v-if="member.role !== 'member'" 
                    class="role" 
                    :class="{ owner: member.role === GROUP_ROLE.OWNER, admin: member.role === GROUP_ROLE.ADMIN}"
                >
                    {{ member.role.valueOf() }}</div>
            </div>
        </div>

        <div id="menu">
            <button @click="toggleMenu">
                <picture>
                    <source srcset="@/assets/icons/ellipsis/ellipsis.svg" media="(prefers-color-scheme: light)">
                    <img src="@/assets/icons/ellipsis/ellipsis.white.svg">
                </picture>
            </button>
            <Menu ref="menu" id="overlay_menu" :model="options" :popup="true"></Menu>
        </div>
    </li>
</template>

<script setup lang="ts">
import Menu from 'primevue/menu';
import { Member } from '~/data/models/GenericModels';
import UserIcon from '@/components/UserIcon/UserIcon.vue';
import { GROUP_ROLE } from '~/data/Enums';

const props = defineProps({
    member: { type: Member, required: true }
});

const emit = defineEmits([
    'change-rank',
    'report-user',
    'remove-user',
    'leave-group'
]);

const menu = ref();
const options = ref<any[]>([]);

const toggleMenu = (event: any) => {
    menu.value.toggle(event);
};

// TODO: Def needs to be refactored
onMounted(() => {
    const _options = [];
    const session = useSessionStore();

    const uuid = session.user?.uuid;
    if (!uuid) return;

    const selectedGroup = session.selectedGroup?.club ?? session.selectedGroup?.organization;
    if (!selectedGroup) return;

    const admin = selectedGroup.members?.find((m) => m.user?.uuid === uuid);
    if (!admin) return;
    
    if (admin.role === 'owner' || admin.role === 'admin') {
        if (uuid !== props.member.user?.uuid) {
            if (props.member.role != 'owner') {
                _options.push(
                    {
                        label: 'Change Role',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('change-rank', { member: props.member });
                        }
                    }
                );

                _options.push(
                    {
                        label: 'Report User',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('report-user', { member: props.member });
                        }
                    }
                );

                _options.push(
                    {
                        label: 'Remove User',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('remove-user', { member: props.member });
                        }
                    }
                );
            } else {
                _options.push(
                    {
                        label: 'Change Role',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('change-rank', { member: props.member });
                        }
                    }
                );
                _options.push(
                    {
                        label: 'Report User',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('report-user', { member: props.member });
                        }
                    }
                );
            }
        } else {
            _options.push(
                {
                    label: 'Leave Group',
                    icon: 'pi pi-bug',
                    command: () => {
                        emit('leave-group', { member: props.member });
                    }
                }
            );
        }
        
    } else {
        if (uuid !== props.member.user?.uuid) {
            _options.push(
                    {
                        label: 'Report User',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('report-user', { member: props.member });
                        }
                    }
                );
        } else {
            _options.push(
                {
                    label: 'Leave Group',
                    icon: 'pi pi-bug',
                    command: () => {
                        emit('leave-group', { member: props.member });
                    }
                }
            );
        }
    }

    options.value = [
        {
            items: [
                ..._options
            ]
        }
    ];
});

</script>

<style scoped>
#member-list-item {
    display: flex;
    cursor: pointer;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    #user-info {
        display: flex;
        align-items: center;

        #info {
            margin: 0rem 1rem;

            .name {
                font-size: 1.3rem;
                color: var(--primary-label-color);
            }

            .role {
                color: white;
                font-size: 0.8rem;
                width: fit-content;
                border-radius: 5px;
                margin-top: 0.25rem;
                padding: 0.15rem 0.5rem;
                text-transform: capitalize;

                &.owner {
                    background-color: var(--tertiary-brand-color);
                }

                &.admin {
                    background-color: var(--secondary-brand-color);
                }
            }
        }
    }

    #menu {
        button {
            border: unset;
            cursor: pointer;
            padding-top: 5px;
            border-radius: 5px;
            background-color: var(--tertiary-background-color);
        }

        img {
            width: 2rem;
            height: 1rem;
            object-fit: cover;
        }
    }
}
</style>