import { MarkdownView, PluginSettingTab, SettingGroup } from "obsidian";
import { ObsidianPlugin } from "./types";
import { locales, setLocale, toLocale, baseLocale } from "../i18n/paraglide/runtime";
import * as m from "../i18n/paraglide/messages";
import { detachSidebar } from "./sidebar";
import { registerCommands, removeCommands } from "./commands";
import { HTMLComponent } from "../components/types";
import { removeWordCount, createWordCount } from "../features/word-count";

export class TemplatePluginSettingTab extends PluginSettingTab {
  plugin: ObsidianPlugin;

  constructor(plugin: ObsidianPlugin) {
    super(plugin.app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    /** General **/
    new SettingGroup(containerEl).setHeading(m.settings_general()).addSetting((setting) => {
      // Language
      setting
        .setName(m.settings_language())
        .setDesc(m.settings_language_desc())
        .addDropdown((component) => {
          component
            .addOptions({
              app: m.settings_language_system(),
              zh: "简体中文",
              en: "English",
            })
            .setValue(this.plugin.settings.locale)
            .onChange(async (value: string) => {
              this.plugin.settings.locale = value as "app" | (typeof locales)[number];
              await setLocale(toLocale(value) ?? baseLocale, { reload: false });
              await this.plugin.saveData(this.plugin.settings);
              await detachSidebar(this.plugin);
              await removeCommands(this.plugin);
              await registerCommands(this.plugin);
              this.display();
            });
        });
    });

    /** Setting Library **/
    new SettingGroup(containerEl).setHeading(m.settings_setting_library()).addSetting((setting) => {
      setting
        .setName(m.settings_setting_library_folder())
        .setDesc(m.settings_setting_library_folder_desc())
        .addDropdown((component) => {
          component.addOption("", m.none_bracket());
          this.plugin.app.vault.getAllFolders(false).forEach((folder) => {
            component.addOption(folder.path, folder.path);
          });
          component.setValue(this.plugin.settings.settingLibraryFolder).onChange(async (value) => {
            this.plugin.settings.settingLibraryFolder = value;
            await this.plugin.saveData(this.plugin.settings);
          });
        });
    });

    /** Auto Number **/
    new SettingGroup(containerEl)
      .setHeading(m.settings_auto_number())
      .addSetting((setting) => {
        // Format
        setting
          .setName(m.settings_auto_number_format())
          .setDesc(m.settings_auto_number_format_desc())
          .addText((component) => {
            component.setValue(this.plugin.settings.autoNumberFormat).onChange(async (value) => {
              this.plugin.settings.autoNumberFormat = value;
              await this.plugin.saveData(this.plugin.settings);
            });
          });
      })
      .addSetting((setting) => {
        // Style
        setting
          .setName(m.settings_auto_number_style())
          .setDesc(m.settings_auto_number_style_desc())
          .addDropdown((component) => {
            component
              .addOptions({
                number: m.settings_auto_number_style_number(),
                cns: m.settings_auto_number_style_cns(),
                cnb: m.settings_auto_number_style_cnb(),
              })
              .setValue(this.plugin.settings.autoNumberStyle)
              .onChange(async (value) => {
                this.plugin.settings.autoNumberStyle = value;
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      });

    /** Layout **/
    new SettingGroup(containerEl)
      .setHeading(m.settings_layouts())
      .addSetting((setting) => {
        // Indent
        setting
          .setName(m.settings_layouts_indent())
          .setDesc(m.settings_layouts_indent_desc())
          .addSlider((component) => {
            component
              .setLimits(0, 4, 1)
              .setInstant(false)
              .setValue(this.plugin.settings.layoutsIndent)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.layoutsIndent = value;
                window.document.documentElement.style.setProperty(
                  "--novel-layouts-indent",
                  `${value}rem`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      })
      .addSetting((setting) => {
        // Line Height
        setting
          .setName(m.settings_layouts_line_height())
          .setDesc(m.settings_layouts_line_height_desc())
          .addSlider((component) => {
            component
              .setLimits(1, 3, 0.1)
              .setInstant(false)
              .setValue(this.plugin.settings.layoutsLineHeight)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.layoutsLineHeight = value;
                window.document.documentElement.style.setProperty(
                  "--novel-layouts-line-height",
                  `${value}rem`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      });

    /** Gridlines **/
    new SettingGroup(containerEl)
      .setHeading(m.settings_gridlines())
      .addSetting((setting) => {
        // Gridlines Display
        setting
          .setName(m.settings_gridlines_enable())
          .setDesc(m.settings_gridlines_enable_desc())
          .addToggle((component) => {
            component.setValue(this.plugin.settings.gridlinesEnable).onChange(async (value) => {
              if (value) {
                window.document.documentElement.addClass("novel-gridlines");
              } else {
                window.document.documentElement.removeClass("novel-gridlines");
              }
              this.plugin.settings.gridlinesEnable = value;
              await this.plugin.saveData(this.plugin.settings);
            });
          });
      })
      .addSetting((setting) => {
        // Gridlines Size
        setting
          .setName(m.settings_gridlines_size())
          .setDesc(m.settings_gridlines_size_desc())
          .addSlider((component) => {
            component
              .setLimits(1, 10, 1)
              .setInstant(false)
              .setValue(this.plugin.settings.gridlinesSize)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.gridlinesSize = value;
                const ratio = this.plugin.settings.gridlinesRatio;
                window.document.documentElement.style.setProperty(
                  "--novel-gridlines-size",
                  `${value}px`,
                );
                window.document.documentElement.style.setProperty(
                  "--novel-gridlines-space",
                  `${value * ratio}px`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      })
      .addSetting((setting) => {
        // Gridlines Ratio
        setting
          .setName(m.settings_gridlines_ratio())
          .setDesc(m.settings_gridlines_ratio_desc())
          .addSlider((component) => {
            component
              .setLimits(1, 5, 1)
              .setInstant(false)
              .setValue(this.plugin.settings.gridlinesRatio)
              .setDynamicTooltip()
              .onChange(async (value) => {
                const size = this.plugin.settings.gridlinesSize;
                this.plugin.settings.gridlinesRatio = value;
                window.document.documentElement.style.setProperty(
                  "--novel-gridlines-size",
                  `${size}px`,
                );
                window.document.documentElement.style.setProperty(
                  "--novel-gridlines-space",
                  `${size * value}px`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      })
      .addSetting((setting) => {
        // Gridlines Thick
        setting
          .setName(m.settings_gridlines_thick())
          .setDesc(m.settings_gridlines_thick_desc())
          .addSlider((component) => {
            component
              .setLimits(1, 5, 1)
              .setInstant(false)
              .setValue(this.plugin.settings.gridlinesThick)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.gridlinesThick = value;
                window.document.documentElement.style.setProperty(
                  "--novel-gridlines-thick",
                  `${value}px`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      })
      .addSetting((setting) => {
        // Gridlines Opacity
        setting
          .setName(m.settings_gridlines_opacity())
          .setDesc(m.settings_gridlines_opacity_desc())
          .addSlider((component) => {
            component
              .setLimits(10, 100, 5)
              .setInstant(false)
              .setValue(this.plugin.settings.gridlinesOpacity)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.gridlinesOpacity = value;
                window.document.documentElement.style.setProperty(
                  "--novel-gridlines-opacity",
                  `${value}%`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      });

    /** Word Count **/
    new SettingGroup(containerEl)
      .setHeading(m.settings_word_count())
      .addSetting((setting) => {
        // Word Count Display
        setting
          .setName(m.settings_word_count_enable())
          .setDesc(m.settings_word_count_enable_desc())
          .addToggle((component) => {
            component.setValue(this.plugin.settings.fileWordCountEnable).onChange(async (value) => {
              this.plugin.settings.fileWordCountEnable = value;
              if (value) {
                await createWordCount(this.plugin);
              } else {
                await removeWordCount(this.plugin);
              }
              await this.plugin.saveData(this.plugin.settings);
            });
          });
      })
      .addSetting((setting) => {
        // Word Count Suffix
        setting
          .setName(m.settings_word_count_suffix())
          .setDesc(m.settings_word_count_suffix_desc())
          .addText((component) => {
            component.setValue(this.plugin.settings.fileWordCountSuffix).onChange(async (value) => {
              this.plugin.settings.fileWordCountSuffix = value.trim();
              await this.plugin.saveData(this.plugin.settings);
              await removeWordCount(this.plugin);
              await createWordCount(this.plugin);
            });
          });
      });

    /** Reading Mode **/
    new SettingGroup(containerEl)
      .setHeading(m.settings_reading_mode())
      .addSetting((setting) => {
        // Reading Mode Enable
        setting
          .setName(m.settings_reading_mode_enable())
          .setDesc(m.settings_reading_mode_enable_desc())
          .addToggle((component) => {
            component.setValue(this.plugin.settings.readingModeEnabled).onChange(async (value) => {
              if (value) {
                window.document.documentElement.addClass("novel-reading-mode");
              } else {
                window.document.documentElement.removeClass("novel-reading-mode");
              }
              this.app.workspace.iterateAllLeaves((leaf) => {
                if (leaf.view instanceof MarkdownView) {
                  leaf.view.previewMode.rerender(true);
                }
              });
              this.plugin.settings.readingModeEnabled = value;
              await this.plugin.saveData(this.plugin.settings);
            });
          });
      })
      .addSetting((setting) => {
        // Reading Mode Indent
        setting
          .setName(m.settings_reading_mode_indent())
          .setDesc(m.settings_reading_mode_indent_desc())
          .addSlider((component) => {
            component
              .setLimits(0, 4, 1)
              .setInstant(false)
              .setValue(this.plugin.settings.readingModeIndent)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.readingModeIndent = value;
                window.document.documentElement.style.setProperty(
                  "--novel-reading-mode-indent",
                  `${value}rem`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      })
      .addSetting((setting) => {
        // Reading Mode Line Height
        setting
          .setName(m.settings_reading_mode_line_height())
          .setDesc(m.settings_reading_mode_line_height_desc())
          .addSlider((component) => {
            component
              .setLimits(1, 3, 0.1)
              .setInstant(false)
              .setValue(this.plugin.settings.readingModeLineHeight)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.readingModeLineHeight = value;
                window.document.documentElement.style.setProperty(
                  "--novel-reading-mode-line-height",
                  `${value}rem`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      })
      .addSetting((setting) => {
        // Reading Mode Paragraph Spacing
        setting
          .setName(m.settings_reading_mode_paragraph_spacing())
          .setDesc(m.settings_reading_mode_paragraph_spacing_desc())
          .addSlider((component) => {
            component
              .setLimits(0, 4, 0.1)
              .setInstant(false)
              .setValue(this.plugin.settings.readingModeParagraphSpacing)
              .setDynamicTooltip()
              .onChange(async (value) => {
                this.plugin.settings.readingModeParagraphSpacing = value;
                window.document.documentElement.style.setProperty(
                  "--novel-reading-mode-paragraph-spacing",
                  `${value}rem`,
                );
                await this.plugin.saveData(this.plugin.settings);
              });
          });
      });

    /** About **/
    new SettingGroup(containerEl).setHeading(m.settings_about()).addSetting((setting) => {
      setting
        .setName(m.settings_version())
        .setDesc(m.settings_version_desc())
        .addComponent((el) => {
          return new HTMLComponent(el, "span", { text: this.plugin.manifest.version });
        });
    });
  }
}

export async function registerSettingsTab(plugin: ObsidianPlugin) {
  plugin.addSettingTab(new TemplatePluginSettingTab(plugin));
}
