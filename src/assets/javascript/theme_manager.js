export default class ThemeManager {
  #isDarkTheme;
  buttonSelector = '.dark-mode-toggle';

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.mediaQuery.addEventListener('change', this.mqSchemeListener.bind(this));
    document.addEventListener('click', this.toggleDarkThemeListener.bind(this));
  }

  static init() {
    const manager = new ThemeManager();

    manager.updateColorScheme();
  }

  get isDarkTheme() {
    if (this.#isDarkTheme === undefined) {
      const storedValue = localStorage.getItem('dark-theme');
      this.#isDarkTheme = storedValue ? storedValue === 'true' : this.mediaQuery.matches;
    }

    return this.#isDarkTheme;
  }

  setDarkTheme(value) {
    this.#isDarkTheme = value;
    localStorage.setItem('dark-theme', value);
  }

  toggleButtonIcon(selector, darkTheme) {
    const icons = document.querySelectorAll(`${this.buttonSelector} ${selector}`);

    icons.forEach(icon => icon.classList.toggle('active', darkTheme));
  }

  toggleDarkThemeListener(ev) {
    if (!ev.target.closest(this.buttonSelector)) return;

    ev.preventDefault();

    this.setDarkTheme(!this.isDarkTheme);
    this.updateColorScheme();
  }

  mqSchemeListener(ev) {
    this.setDarkTheme(ev.matches);
    this.updateColorScheme();
  }

  updateColorScheme() {
    document.body.setAttribute('data-dark-theme', this.isDarkTheme);
    this.toggleButtonIcon('.fa-sun', !this.isDarkTheme);
    this.toggleButtonIcon('.fa-moon', this.isDarkTheme);
  }
}
