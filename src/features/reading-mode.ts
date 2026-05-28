import { ObsidianPlugin } from "../core/types";
import { MarkdownPostProcessorContext } from "obsidian";

/**
 * Initialize the reading mode features
 * @param plugin ObsidianPlugin
 */
export async function initializeReadingMode(plugin: ObsidianPlugin) {
  plugin.registerMarkdownPostProcessor((el: HTMLElement, ctx: MarkdownPostProcessorContext) => {
    // Skip setting library file
    if (
      plugin.settings.settingLibraryFolder &&
      ctx.sourcePath.startsWith(plugin.settings.settingLibraryFolder)
    )
      return;
    if (plugin.settings.readingModeEnabled) {
      let ps = el.getElementsByTagName("p");
      let paragraphs: string[] = [];
      const parser = new DOMParser();
      for (let i = 0; i < ps.length; i++) {
        ps.item(i)
          ?.innerHTML.split("<br>")
          .forEach((item) => {
            paragraphs.push(
              parser.parseFromString(item.trim(), "text/html").body.textContent.trim(),
            );
          });
      }
      el.empty();
      paragraphs.forEach((paragraph) => {
        el.createEl("p", {
          text: paragraph,
        });
      });
      window.document.documentElement.addClass("novel-reading-mode");
      window.document.documentElement.style.setProperty(
        "--novel-reading-mode-indent",
        `${plugin.settings.readingModeIndent}rem`,
      );
      window.document.documentElement.style.setProperty(
        "--novel-reading-mode-line-height",
        `${plugin.settings.readingModeLineHeight}rem`,
      );
      window.document.documentElement.style.setProperty(
        "--novel-reading-mode-paragraph-spacing",
        `${plugin.settings.readingModeParagraphSpacing}rem`,
      );
    } else {
      window.document.documentElement.removeClass("novel-reading-mode");
    }
  });
}
