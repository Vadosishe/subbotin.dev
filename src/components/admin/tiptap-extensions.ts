import { Extension } from '@tiptap/core';

export const KeyboardShortcuts = Extension.create({
    name: 'keyboardShortcuts',

    addKeyboardShortcuts() {
        return {
            'Mod-s': () => {
                const onSave = this.options.onSave;
                if (onSave) {
                    onSave();
                    return true;
                }
                return false;
            },
        };
    },
});
