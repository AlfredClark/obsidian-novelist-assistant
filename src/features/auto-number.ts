import nzh from "nzh";
import * as m from "../i18n/paraglide/messages";
import { ObsidianPlugin } from "../core/types";
import { Menu, TFolder, TAbstractFile, TFile } from "obsidian";

function parseAutoNumber(value: string, style: string): number {
  if (style === "number") return Number(value);
  return Number(style === "cns" ? nzh.cn.decodeS(value) : nzh.cn.decodeB(value));
}

function formatAutoNumber(value: number, style: string): string {
  if (style === "number") return String(value);
  if (style === "cns") return nzh.cn.encodeS(value);
  return nzh.cn.encodeB(value);
}

async function createNewChapter(plugin: ObsidianPlugin, file: TAbstractFile): Promise<void> {
  const folderPath = file instanceof TFolder ? file.path : file.parent?.path;
  if (!folderPath) return;
  const folder = plugin.app.vault.getFolderByPath(folderPath);
  if (!folder) return;
  const files = folder.children
    .filter((value): value is TFile => value instanceof TFile && value.extension === "md")
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
    );
  const pattern = plugin.settings.autoNumberFormat.replace("{n}", "(.+?)");
  const re = new RegExp(pattern);
  let maxNumber = 0;
  files.forEach((f) => {
    const m = f.name.match(re);
    if (m) {
      if (m[1] === undefined) return;
      const num = parseAutoNumber(m[1], plugin.settings.autoNumberStyle);
      if (!isNaN(num) && num > maxNumber) maxNumber = num;
    }
  });
  const next = formatAutoNumber(maxNumber + 1, plugin.settings.autoNumberStyle);
  const nextName = plugin.settings.autoNumberFormat.replace("{n}", next);
  await plugin.app.vault.create(`${folderPath}/${nextName}.md`, "").then(async (value) => {
    const leaf = plugin.app.workspace.getLeaf(false);
    await leaf.openFile(value);
    plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
  });
}

/**
 * Initialize the auto number features
 * @param plugin ObsidianPlugin
 */
export async function initializeAutoNumber(plugin: ObsidianPlugin) {
  plugin.registerEvent(
    plugin.app.workspace.on("file-menu", (menu: Menu, file: TAbstractFile, _source: string) => {
      if (!plugin.settings.autoNumberFormat) return;
      menu.addSeparator().addItem((item) => {
        item
          .setIcon("file")
          .setTitle(m.file_menu_create_new_chapter())
          .onClick(async () => await createNewChapter(plugin, file));
      });
    }),
  );
}
