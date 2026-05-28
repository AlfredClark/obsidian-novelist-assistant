import { Plugin } from "obsidian";
import { locales } from "../i18n/paraglide/runtime";

export type Settings = {
  // General
  locale: "app" | (typeof locales)[number];
  // Layouts
  layoutsIndent: number;
  layoutsLineHeight: number;
  // Gridlines
  gridlinesEnable: boolean;
  gridlinesSize: number;
  gridlinesRatio: number;
  gridlinesThick: number;
  gridlinesOpacity: number;
  // Reading Mode
  readingModeEnabled: boolean;
  readingModeIndent: number;
  readingModeLineHeight: number;
  readingModeParagraphSpacing: number;
  // Word Count
  fileWordCountEnable: boolean;
  fileWordCountSuffix: string;
  // Setting Library
  settingLibraryFolder: string;
  // Auto Number
  autoNumberFormat: string;
  autoNumberStyle: string;
};

export const DEFAULT_SETTINGS: Settings = {
  locale: "app",
  layoutsIndent: 2,
  layoutsLineHeight: 2,
  gridlinesEnable: true,
  gridlinesSize: 5,
  gridlinesRatio: 2,
  gridlinesThick: 1,
  gridlinesOpacity: 50,
  readingModeEnabled: true,
  readingModeIndent: 2,
  readingModeLineHeight: 1.5,
  readingModeParagraphSpacing: 0.5,
  fileWordCountEnable: true,
  fileWordCountSuffix: "字",
  settingLibraryFolder: "",
  autoNumberFormat: "第{n}章",
  autoNumberStyle: "number",
};

export class ObsidianPlugin extends Plugin {
  settings: Settings;
  commandsIds: string[];
}
