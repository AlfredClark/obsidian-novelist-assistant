import { ObsidianPlugin } from "../core/types";
import { View, TFile } from "obsidian";

// Obsidian's FileExplorerView type doesn't expose fileItems, so we extend View to access it.
interface FileExplorerView extends View {
  fileItems: Record<string, { selfEl: HTMLElement }>;
}

// Strip markdown syntax and count Chinese characters + English words.
// Code blocks, inline code, images, links, HTML tags, and formatting markers are removed first.
function countMarkdownWords(md: string) {
  let text = md.replace(/```[\s\S]*?```/g, "").replace(/`[^`]*`/g, "");
  text = text.replace(/!\[.*?]\(.*?\)/g, "");
  text = text.replace(/\[([^\]]*)]\([^)]*\)/g, "$1");
  text = text.replace(/<[^>]*>/g, "");
  text = text.replace(/[#*_~>`\-+=]/g, " ");
  text = text.replace(/\s+/g, " ").trim();
  const chineseChars = (text.match(/[一-鿿]/g) || []).length;
  const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
  return chineseChars + englishWords;
}

// `last()` picks the last leaf — there's only one file-explorer view instance.
function getExplorerView(plugin: ObsidianPlugin) {
  return plugin.app.workspace.getLeavesOfType("file-explorer").last()?.view as
    | FileExplorerView
    | undefined;
}

// Remove old word-count spans before setting a new one to avoid duplicates on re-count.
function clearFileItemSpans(element: HTMLElement) {
  for (const span of Array.from(element.getElementsByTagName("span"))) {
    span.remove();
  }
}

function setFileItemCount(element: HTMLElement, count: number, suffix?: string) {
  clearFileItemSpans(element);
  element.createEl("span", {
    text: `${count}${suffix?.trim() ? " " + suffix?.trim() : ""}`,
    attr: { style: "margin-left: auto;" },
  });
}

async function getWordCount(file: TFile, plugin: ObsidianPlugin) {
  const content = await plugin.app.vault.cachedRead(file);
  return countMarkdownWords(content);
}

// Listen for file changes and update the corresponding file explorer item in real time.
function registerWordCountModifyEvent(plugin: ObsidianPlugin) {
  plugin.registerEvent(
    plugin.app.vault.on("create", async (file) => {
      if (!plugin.settings.fileWordCountEnable) return;
      const view = getExplorerView(plugin);
      const element = view?.fileItems[file.path]?.selfEl;
      if (!element) return;
      const fileRef = plugin.app.vault.getFileByPath(file.path);
      if (!fileRef) return;
      setFileItemCount(element, 0, plugin.settings.fileWordCountSuffix);
    }),
  );
  plugin.registerEvent(
    plugin.app.vault.on("modify", async (file) => {
      if (!plugin.settings.fileWordCountEnable) return;
      const view = getExplorerView(plugin);
      const element = view?.fileItems[file.path]?.selfEl;
      if (!element) return;
      const fileRef = plugin.app.vault.getFileByPath(file.path);
      if (!fileRef) return;
      const count = await getWordCount(fileRef, plugin);
      setFileItemCount(element, count, plugin.settings.fileWordCountSuffix);
    }),
  );
}

export async function removeWordCount(plugin: ObsidianPlugin) {
  const view = getExplorerView(plugin);
  if (!view) return;
  for (const key in view.fileItems) {
    const el = view.fileItems[key]?.selfEl;
    if (el) clearFileItemSpans(el);
  }
}

// Populate word counts for all Markdown files on initial load.
export async function createWordCount(plugin: ObsidianPlugin) {
  const view = getExplorerView(plugin);
  if (!view) return;
  const counts: Map<string, number> = new Map();
  for (const file of plugin.app.vault.getMarkdownFiles()) {
    counts.set(file.path, await getWordCount(file, plugin));
  }
  for (const key in view.fileItems) {
    const el = view.fileItems[key]?.selfEl;
    if (!el) continue;
    const count = counts.get(key);
    if (count !== undefined) setFileItemCount(el, count, plugin.settings.fileWordCountSuffix);
  }
}

/**
 * Initialize the word count features
 * @param plugin ObsidianPlugin
 */
export async function initializeWordCount(plugin: ObsidianPlugin) {
  if (plugin.settings.fileWordCountEnable) {
    plugin.app.workspace.onLayoutReady(async () => {
      await createWordCount(plugin);
    });
  }
  registerWordCountModifyEvent(plugin);
}
