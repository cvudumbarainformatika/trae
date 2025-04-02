export const htmlSafe = {
  mounted(el, binding, vnode) {
    const fields = binding.value?.fields || []
    const data = binding.value?.data || {}
    const searchQuery = binding.value?.searchQuery || ''
    
    fields.forEach(field => {
      if (data[field]) {
        const elements = el.querySelectorAll(`[data-field="${field}"]`)
        elements.forEach(element => {
          const text = data[field]
          if (searchQuery) {
            const regex = new RegExp(`(${searchQuery})`, 'gi')
            element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>')
          } else {
            element.innerHTML = text
          }
        })
      }
    })
  },
  updated(el, binding, vnode) {
    const fields = binding.value?.fields || []
    const data = binding.value?.data || {}
    const searchQuery = binding.value?.searchQuery || ''
    
    fields.forEach(field => {
      if (data[field]) {
        const elements = el.querySelectorAll(`[data-field="${field}"]`)
        elements.forEach(element => {
          const text = data[field]
          if (searchQuery) {
            const regex = new RegExp(`(${searchQuery})`, 'gi')
            element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>')
          } else {
            element.innerHTML = text
          }
        })
      }
    })
  }
}
