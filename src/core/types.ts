import { Plugin } from "obsidian";
import { locales } from "../i18n/paraglide/runtime";

export type Settings = {
  // General
  locale: "app" | (typeof locales)[number];
  // Layouts
  layoutsEnable: boolean;
  indent: number;
  lineHeight: number;
  // Gridlines
  gridlinesEnable: boolean;
  gridlinesSize: number;
  gridlinesRatio: number;
  gridlinesThick: number;
  gridlinesOpacity: number;
  // Word Count
  fileWordCountEnable: boolean;
  fileWordCountSuffix: string;
  // Setting Library
  settingLibraryFolder: string;
};

export const DEFAULT_SETTINGS: Settings = {
  locale: "app",
  layoutsEnable: true,
  indent: 2,
  lineHeight: 2,
  gridlinesEnable: true,
  gridlinesSize: 5,
  gridlinesRatio: 2,
  gridlinesThick: 1,
  gridlinesOpacity: 50,
  fileWordCountEnable: true,
  fileWordCountSuffix: "字",
  settingLibraryFolder: "",
};

export class ObsidianPlugin extends Plugin {
  settings: Settings;
  commandsIds: string[];
}
