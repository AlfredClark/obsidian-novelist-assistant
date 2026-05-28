import nzh from "nzh";
import * as m from "../i18n/paraglide/messages";
import { ObsidianPlugin } from "../core/types";
import { Menu, TAbstractFile, TFile } from "obsidian";

export async function initializeAutoNumbers(plugin: ObsidianPlugin) {
  plugin.registerEvent(
    plugin.app.workspace.on("file-menu", (menu: Menu, file: TAbstractFile, _source: string) => {
      if (!plugin.settings.autoNumberFormat) return;
      menu.addSeparator().addItem((item) => {
        item
          .setIcon("file")
          .setTitle(m.file_menu_create_new_chapter())
          .onClick(async () => {
            const path = file.path;
            const files = plugin.app.vault
              .getFolderByPath(path)
              ?.children.filter((value) => value instanceof TFile && value.extension === "md")
              .map((value) => value.name);
            if (files) {
              const patten = plugin.settings.autoNumberFormat.replace("{n}", "(.+?)");
              const last = files.last()?.match(new RegExp(patten));
              const number = String(last ? last[1] : 0);
              let next: string;
              if (plugin.settings.autoNumberStyle === "number") {
                next = String(Number(number) + 1);
              } else if (plugin.settings.autoNumberStyle === "cns") {
                next = nzh.cn.encodeS(nzh.cn.decodeS(number) + 1);
              } else {
                next = nzh.cn.encodeB(nzh.cn.decodeB(number) + 1);
              }
              const nextName = plugin.settings.autoNumberFormat.replace("{n}", next);
              await plugin.app.vault.create(`${path}/${nextName}.md`, "").then(async (value) => {
                const leaf = plugin.app.workspace.getLeaf(false);
                await leaf.openFile(value);
                plugin.app.workspace.setActiveLeaf(leaf, { focus: true });
              });
            }
          });
      });
    }),
  );
}
