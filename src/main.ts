import { ObsidianPlugin } from "./core/types";
import { registerLocales } from "./core/locales";
import { registerSettings } from "./core/settings";
import { registerRibbonIcon } from "./core/ribbon-icon";
import { registerSidebar } from "./core/sidebar";
import { registerSettingsTab } from "./core/settings-tab";
import { registerMenu } from "./core/menu";
import { registerCommands } from "./core/commands";
import { initializeLayouts } from "./features/layouts";
import { initializeGridlines } from "./features/gridlines";
import { initializeWordCount } from "./features/word-count";
import { initializeSettingLibrary } from "./features/setting-library";
import { initializeReadingMode } from "./features/reading-mode";
import { initializeAutoNumbers } from "./features/auto-number";

export default class TemplatePlugin extends ObsidianPlugin {
  async onload() {
    // Register Core
    await registerSettings(this);
    await registerLocales(this);
    await registerSidebar(this);
    await registerRibbonIcon(this);
    await registerSettingsTab(this);
    await registerMenu(this);
    await registerCommands(this);
    // Initialize Features
    await initializeLayouts(this);
    await initializeGridlines(this);
    await initializeWordCount(this);
    await initializeReadingMode(this);
    await initializeSettingLibrary(this);
    await initializeAutoNumbers(this);
  }
}
