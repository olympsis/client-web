<template>
    <li id="member-list-item">
        <div id="user-info">
            <UserIcon :user="member.user" :size="3"/>
            <a class="name">{{ member.user?.username ?? 'olympsis-user' }}</a>
        </div>

        <div id="menu">
            <button @click="toggleMenu">
                <picture>
                    <source srcset="@/assets/icons/ellipsis/ellipsis.svg">
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

const props = defineProps({
    member: { type: Member, required: true }
});

const emit = defineEmits([
    'promote-user',
    'demote-user',
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
                        label: 'Promote User',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('promote-user', { member: props.member });
                        }
                    }
                );

                if (props.member.role != 'member') {
                    _options.push(
                        {
                            label: 'Demote User',
                            icon: 'pi pi-bug',
                            command: () => {
                                emit('demote-user', { member: props.member });
                            }
                        }
                    );
                }

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
                        label: 'Demote User',
                        icon: 'pi pi-bug',
                        command: () => {
                            emit('demote-user', { member: props.member });
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

        .name {
            font-size: 1.3rem;
            margin: 0rem 1rem;
            color: var(--primary-label-color);
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