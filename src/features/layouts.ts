import { ObsidianPlugin } from "../core/types";

/**
 * Initialize the layout features
 * @param plugin ObsidianPlugin
 */
export async function initializeLayouts(plugin: ObsidianPlugin) {
  if (plugin.settings.layoutsEnable) {
    window.document.documentElement.addClass("novel-layouts");
    window.document.documentElement.style.setProperty(
      "--novel-indent",
      `${plugin.settings.indent}rem`,
    );
    window.document.documentElement.style.setProperty(
      "--novel-line-height",
      `${plugin.settings.lineHeight}rem`,
    );
  } else {
    window.document.documentElement.removeClass("novel-layouts");
  }
}
