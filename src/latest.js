document.dispatchEvent(new CustomEvent("<%= pkg.name.replace(/-/g, '') %>Version",{detail:{v:"<%= pkg.version %>"}}))
