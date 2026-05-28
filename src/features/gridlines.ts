import { ObsidianPlugin } from "../core/types";

/**
 * Initialize the gridlines features
 * @param plugin ObsidianPlugin
 */
export async function initializeGridlines(plugin: ObsidianPlugin) {
  if (plugin.settings.gridlinesEnable) {
    window.document.documentElement.addClass("novel-gridlines");
    window.document.documentElement.style.setProperty(
      "--novel-gridlines-size",
      `${plugin.settings.gridlinesSize}px`,
    );
    window.document.documentElement.style.setProperty(
      "--novel-gridlines-space",
      `${plugin.settings.gridlinesSize * plugin.settings.gridlinesRatio}px`,
    );
    window.document.documentElement.style.setProperty(
      "--novel-gridlines-thick",
      `${plugin.settings.gridlinesThick}px`,
    );
    window.document.documentElement.style.setProperty(
      "--novel-gridlines-opacity",
      `${plugin.settings.gridlinesOpacity}%`,
    );
  } else {
    window.document.documentElement.removeClass("novel-gridlines");
  }
}
