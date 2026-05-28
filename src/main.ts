import { ObsidianPlugin } from "./core/types";
import { registerLocales } from "./core/locales";
import { registerSettings } from "./core/settings";
import { registerRibbonIcon } from "./core/ribbon-icon";
import { registerSidebar } from "./core/sidebar";
import { registerSettingsTab } from "./core/settings-tab";
import { registerMenu } from "./core/menu";
import { registerCommands } from "./core/commands";

export default class TemplatePlugin extends ObsidianPlugin {
  async onload() {
    await registerSettings(this);
    await registerLocales(this);
    await registerSidebar(this);
    await registerRibbonIcon(this);
    await registerSettingsTab(this);
    await registerMenu(this);
    await registerCommands(this);
  }
}
