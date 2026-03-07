<template>
    <div class="editor-wrapper">
        <!-- Toolbar -->
        <div class="editor-toolbar" v-if="editor">
            <button
                type="button"
                :class="{ active: editor.isActive('bold') }"
                @click="editor.chain().focus().toggleBold().run()"
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                :class="{ active: editor.isActive('italic') }"
                @click="editor.chain().focus().toggleItalic().run()"
                title="Italic"
            >
                <em>I</em>
            </button>

            <span class="toolbar-divider"></span>

            <button
                type="button"
                :class="{ active: editor.isActive('bulletList') }"
                @click="editor.chain().focus().toggleBulletList().run()"
                title="Bullet List"
            >
                &bull;
            </button>
            <button
                type="button"
                :class="{ active: editor.isActive('orderedList') }"
                @click="editor.chain().focus().toggleOrderedList().run()"
                title="Ordered List"
            >
                1.
            </button>

            <span class="toolbar-divider"></span>

            <button
                type="button"
                :class="{ active: editor.isActive('link') }"
                @click="toggleLink"
                title="Link"
            >
                &#128279;
            </button>
        </div>

        <!-- Editor content -->
        <EditorContent :editor="editor" class="editor-content" />
    </div>
</template>

<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue';
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

const model = defineModel<string>({ default: '' });

const editor = useEditor({
    content: model.value,
    extensions: [
        StarterKit.configure({
            // Disable features we don't need
            heading: false,
            codeBlock: false,
            code: false,
            blockquote: false,
            horizontalRule: false,
            hardBreak: false,
        }),
        Link.configure({
            openOnClick: false,
            HTMLAttributes: {
                rel: 'noopener noreferrer',
                target: '_blank',
            },
        }),
    ],
    onUpdate({ editor }) {
        model.value = editor.getHTML();
    },
});

// Sync external model changes back into the editor
watch(model, (newValue) => {
    if (editor.value && editor.value.getHTML() !== newValue) {
        editor.value.commands.setContent(newValue, { emitUpdate: false });
    }
});

function toggleLink() {
    if (!editor.value) return;

    if (editor.value.isActive('link')) {
        editor.value.chain().focus().unsetLink().run();
        return;
    }

    const url = window.prompt('Enter URL');
    if (url) {
        editor.value.chain().focus().setLink({ href: url }).run();
    }
}

onBeforeUnmount(() => {
    editor.value?.destroy();
});
</script>

<style scoped>
.editor-wrapper {
    display: flex;
    flex-direction: column;
    border-radius: 14px;
    overflow: hidden;
    border: 1px solid var(--component-border-color);
    resize: vertical;
    min-height: 14rem;
}

/* ── Toolbar ─────────────────────────────────────────────────────────────── */

.editor-toolbar {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.4rem 0.6rem;
    border-bottom: 1px solid var(--component-border-color);
    background-color: var(--secondary-background-color);

    button {
        all: unset;
        cursor: pointer;
        width: 1.75rem;
        height: 1.75rem;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        font-size: 0.85rem;
        color: var(--primary-label-color);

        &:hover {
            background-color: var(--tertiary-background-color);
        }

        &.active {
            color: var(--tertiary-brand-color);
            background-color: color-mix(in srgb, var(--tertiary-brand-color) 12%, transparent);
        }
    }
}

.toolbar-divider {
    width: 1px;
    height: 1.25rem;
    margin: 0 0.25rem;
    background-color: var(--component-border-color);
}

/* ── Content area ────────────────────────────────────────────────────────── */

.editor-content {
    flex: 1;
    display: flex;
    flex-direction: column;

    :deep(.ProseMirror) {
        flex: 1;
    }

    :deep(.tiptap) {
        min-height: 0;
        height: 100%;
        padding: 0.75rem;
        font-size: 1rem;
        line-height: 1.5;
        outline: none;
        color: var(--primary-label-color);
        background-color: var(--primary-background-color);

        p {
            margin: 0 0 0.25rem;
        }

        ul, ol {
            padding-left: 1.5rem;
            margin: 0.25rem 0;
        }

        a {
            color: var(--tertiary-brand-color);
            text-decoration: underline;
            cursor: pointer;
        }

        /* Placeholder when empty */
        p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: gray;
            pointer-events: none;
            height: 0;
        }
    }
}
</style>
