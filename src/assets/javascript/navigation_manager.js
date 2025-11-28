export default class {
  animationDuration = 0
  navigationBreakpoint = 1024

  constructor() {
    this.navbar = document.querySelector('.navbar')
    this.setNavbarExpanded(false)
    this.loadCSSVariables()
    this.setupListeners()
  }

  setupListeners() {
    this.navbar.addEventListener('click', (ev) => {
      const target = ev.target

      if (target.closest('.toggle-button')) {
        this.toggleNavbar()
      } else if (target.closest('.overlay')) {
        this.toggleNavbar(false)
      } else if (target.closest('.dropdown-toggle')) {
        if (window.innerWidth >= this.navigationBreakpoint) return

        ev.preventDefault()

        const dropdown = target.closest('.dropdown')
        const isActive = dropdown.classList.contains('active')

        this.#closeAllDropdowns()
        this.#toggleDropdown(dropdown, !isActive)
      } else if (target.closest('.nav-link')) {
        const targetLink = target.getAttribute('href')

        if (targetLink.includes('#') && this.isNavbarExpanded()) {
          this.toggleNavbar(false)
        }
      }
    })

    window.addEventListener('resize', () => {
      if (window.innerWidth < this.navigationBreakpoint || !this.isNavbarExpanded()) return

      this.setNavbarExpanded(false)
      this.#closeAllDropdowns()
    })
  }

  #activeDropdowns() {
    return Array.from(this.navbar.querySelectorAll('.dropdown.active'))
  }

  #toggleDropdown(dropdown, active) {
    dropdown.classList.toggle('active', active)
  }

  #closeAllDropdowns() {
    this.#activeDropdowns().forEach(dropdown => this.#toggleDropdown(dropdown, false))
  }

  toggleNavbar(expanded) {
    if (expanded === undefined) expanded = !this.isNavbarExpanded()

    this.setNavbarExpanded(expanded)
    this.animateNavbar()

    if (!expanded) this.#closeAllDropdowns()
  }

  setNavbarExpanded(expanded) {
    document.body.dataset.navbarExpanded = expanded
  }

  isNavbarExpanded() {
    return document.body.dataset.navbarExpanded === "true"
  }

  animateNavbar() {
    document.body.dataset.navbarAnimating = "true"
    setTimeout(() => {
      document.body.dataset.navbarAnimating = "false"
    }, this.animationDuration)
  }

  loadCSSVariables() {
    const rootStyles = getComputedStyle(document.documentElement)
    const animationDuration = rootStyles.getPropertyValue('--nav-transition-duration')
    const breakpoint = rootStyles.getPropertyValue('--nav-breakpoint')

    this.navigationBreakpoint = parseInt(breakpoint) * parseFloat(rootStyles.fontSize)
    this.animationDuration = parseFloat(animationDuration) * 1000
  }
}
