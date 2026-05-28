import { ObsidianPlugin } from "../core/types";
import { TFolder, normalizePath, TFile, Menu, Editor } from "obsidian";
import * as m from "../i18n/paraglide/messages";

// Create an empty .md file for a selection in the specified folder if it doesn't exist.
async function createSettingLibraryFile(folder: TFolder, name: string, plugin: ObsidianPlugin) {
  const path = normalizePath(`${folder.path}/${name}.md`);
  if (!plugin.app.vault.getFileByPath(path)) {
    await plugin.app.vault.create(path, "");
  }
}

// Collect all markdown file names (without extension) from all subfolders of the library folder.
export function getAllSettingLibraries(plugin: ObsidianPlugin): string[] {
  const folderPath = plugin.settings.settingLibraryFolder.trim();
  if (!folderPath) return [];

  const folder = plugin.app.vault.getFolderByPath(folderPath);
  if (!folder) return [];

  const libraries: string[] = [];
  for (const child of folder.children) {
    if (!(child instanceof TFolder)) continue;
    for (const file of child.children) {
      if (file instanceof TFile) {
        libraries.push(file.basename);
      }
    }
  }
  return libraries;
}

// Menu items shown when there is no selection: sync all library names as links,
// strip links back to plain names for a specific library, or strip all wiki-links.
function addEditorMenuItems(menu: Menu, editor: Editor, plugin: ObsidianPlugin) {
  const items: { title: string; onClick: () => Promise<void> }[] = [
    {
      title: m.editor_menu_sync_library(),
      onClick: async () => {
        let content = editor.getValue();
        getAllSettingLibraries(plugin).forEach((libName) => {
          content = content.replace(new RegExp(libName, "g"), `[[${libName}]]`);
        });
        content = content.replace(/\[{3,}/g, "[[").replace(/]{3,}/g, "]]");
        editor.setValue(content);
      },
    },
    {
      title: m.editor_menu_clear_library(),
      onClick: async () => {
        let content = editor.getValue();
        getAllSettingLibraries(plugin).forEach((libName) => {
          content = content.replace(new RegExp(`\\[\\[${libName}]]`, "g"), libName);
        });
        editor.setValue(content);
      },
    },
    {
      title: m.editor_menu_clear_all_links(),
      onClick: async () => {
        let content = editor.getValue();
        content = content.replace(/\[\[([^[^\]]+)]]/g, "$1");
        editor.setValue(content);
      },
    },
  ];

  for (const item of items) {
    menu.addItem((menuItem) => {
      menuItem.setIcon("table-of-contents").setTitle(item.title).onClick(item.onClick);
    });
  }
}

// Menu items shown when text is selected: create a .md file per library subfolder and wrap the selection in a wiki-link.
function addSelectionMenuItems(
  menu: Menu,
  editor: Editor,
  selection: string,
  plugin: ObsidianPlugin,
) {
  const folderPath = plugin.settings.settingLibraryFolder.trim();
  if (!folderPath) return;

  const folder = plugin.app.vault.getFolderByPath(folderPath);
  if (!folder) return;

  for (const child of folder.children) {
    if (!(child instanceof TFolder)) continue;
    menu.addItem((item) => {
      item
        .setIcon("table-of-contents")
        .setTitle(m.editor_menu_add_to_library({ name: child.name }))
        .onClick(async () => {
          await createSettingLibraryFile(child, selection, plugin);
          editor.replaceSelection(`[[${selection}]]`);
        });
    });
  }
}

/**
 * Initialize the setting library features
 * @param plugin ObsidianPlugin
 */
export async function initializeSettingLibrary(plugin: ObsidianPlugin) {
  plugin.registerEvent(
    plugin.app.workspace.on("editor-menu", (menu, editor) => {
      const selection = editor.getSelection();
      if (!selection) {
        addEditorMenuItems(menu, editor, plugin);
      } else {
        addSelectionMenuItems(menu, editor, selection, plugin);
      }
    }),
  );
}
