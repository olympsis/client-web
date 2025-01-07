import { useSessionStore } from "~/stores/session-store";

export default defineNuxtRouteMiddleware((to, from) => {
    const session = useSessionStore()
});