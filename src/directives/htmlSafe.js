export const htmlSafe = {
  mounted(el, binding, vnode) {
    const fields = binding.value?.fields || []
    const data = binding.value?.data || {}
    const searchQuery = binding.value?.searchQuery || ''
    
    if (!searchQuery) return

    fields.forEach(field => {
      if (data[field]) {
        const elements = el.querySelectorAll(`[data-field="${field}"]`)
        elements.forEach(element => {
          const text = data[field]
          const regex = new RegExp(`(${searchQuery})`, 'gi')
          element.innerHTML = text.replace(regex, '<em class="highlight">$1</em>')
        })
      }
    })
  },
  updated(el, binding, vnode) {
    const fields = binding.value?.fields || []
    const data = binding.value?.data || {}
    const searchQuery = binding.value?.searchQuery || ''
    
    if (!searchQuery) return

    fields.forEach(field => {
      if (data[field]) {
        const elements = el.querySelectorAll(`[data-field="${field}"]`)
        elements.forEach(element => {
          const text = data[field]
          const regex = new RegExp(`(${searchQuery})`, 'gi')
          element.innerHTML = text.replace(regex, '<span class="highlight">$1</span>')
        })
      }
    })
  }
}