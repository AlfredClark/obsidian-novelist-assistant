import { PluginSettingTab, Setting } from "obsidian";
import { ObsidianPlugin } from "./types";
import { HTMLComponent, ObsidianSvelteComponent } from "../components/types";
import LocaleSettings from "../components/settings/LocaleSettings.svelte";
import { locales, setLocale, toLocale, baseLocale } from "../i18n/paraglide/runtime";
import * as m from "../i18n/paraglide/messages";
import { detachSidebar } from "./sidebar";
import { registerCommands, removeCommands } from "./commands";

export class TemplatePluginSettingTab extends PluginSettingTab {
  plugin: ObsidianPlugin;
  activeSubTab: string;
  components: ObsidianSvelteComponent[] | undefined;

  constructor(plugin: ObsidianPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
    this.components = [];
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    // Tab Bar
    const tabBar = containerEl.createEl("div", { cls: "my-tab-bar" });
    const contentEl = containerEl.createEl("div", { cls: "my-tab-content" });

    // Show Tab
    const showTab = (tab: string) => {
      this.activeSubTab = tab;
      contentEl.empty();
      if (tab === "general") {
        // General Settings
        new Setting(contentEl)
          .setName(m.settings_language())
          .setDesc(m.settings_language_desc())
          .addComponent((el) => {
            const comp = new ObsidianSvelteComponent(el, LocaleSettings, {
              locale: this.plugin.settings.locale,
              onLocaleChange: async (locale: string) => {
                this.plugin.settings.locale = locale as "app" | (typeof locales)[number];
                await setLocale(toLocale(locale) ?? baseLocale, { reload: false });
                await this.plugin.saveData(this.plugin.settings);
                await detachSidebar(this.plugin);
                await removeCommands(this.plugin);
                await registerCommands(this.plugin);
                this.display();
              },
            });
            this.components?.push(comp);
            return comp;
          });
      } else if (tab === "about") {
        // About Settings
        new Setting(contentEl).setName(m.settings_version()).addComponent((el) => {
          return new HTMLComponent(el, "span", { text: this.plugin.manifest.version });
        });
      }
    };

    // Tab Buttons
    const generalBtn = tabBar.createEl("button", { text: m.settings_general() });
    generalBtn.onclick = () => showTab("general");
    const aboutBtn = tabBar.createEl("button", { text: m.settings_about() });
    aboutBtn.onclick = () => showTab("about");

    showTab("general");
  }

  hide(): void {
    this.components?.forEach((component) => {
      component.destroy();
    });
    this.components = [];
  }
}

export async function registerSettingsTab(plugin: ObsidianPlugin) {
  plugin.addSettingTab(new TemplatePluginSettingTab(plugin));
}
