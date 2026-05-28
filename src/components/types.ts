import { BaseComponent } from "obsidian";
import { mount, Component, unmount } from "svelte";

/**
 * Bridges a Svelte component into the Obsidian settings UI.
 *
 * Wraps a Svelte component as an Obsidian BaseComponent so it can be
 * passed to `Setting.addComponent`. Handles mount / unmount lifecycle.
 */
export class ObsidianSvelteComponent extends BaseComponent {
  instance: Record<string, unknown>;
  disabled = false;

  constructor(el: HTMLElement, component: Component, props?: Record<string, unknown>) {
    super();
    this.instance = mount(component, { target: el, props });
  }

  destroy(): void {
    void unmount(this.instance);
  }

  then(cb: (component: this) => unknown): this {
    cb(this);
    return this;
  }

  setDisabled(disabled: boolean): this {
    this.disabled = disabled;
    return this;
  }
}

/**
 * Mount Svelte Component to element
 */
export class SvelteComponent extends HTMLElement {
  public instance: Record<string, unknown>;

  constructor(el: HTMLElement, component: Component, props?: Record<string, unknown>) {
    super();
    this.instance = mount(component, { target: el, props });
  }
}

/**
 * Create Obsidian BaseComponent by HTML tag and option
 */
export class HTMLComponent extends BaseComponent {
  public element: HTMLElement;

  constructor(el: HTMLElement, tag: keyof HTMLElementTagNameMap, option: DomElementInfo) {
    super();
    this.element = el.createEl(tag, option);
  }
}
