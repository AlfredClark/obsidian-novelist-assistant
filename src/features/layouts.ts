import { ObsidianPlugin } from "../core/types";

/**
 * Initialize the layout features
 * @param plugin ObsidianPlugin
 */
export async function initializeLayouts(plugin: ObsidianPlugin) {
  window.document.documentElement.addClass("novel-layouts");
  window.document.documentElement.style.setProperty(
    "--novel-layouts-indent",
    `${plugin.settings.layoutsIndent}rem`,
  );
  window.document.documentElement.style.setProperty(
    "--novel-layouts-line-height",
    `${plugin.settings.layoutsLineHeight}rem`,
  );
}
