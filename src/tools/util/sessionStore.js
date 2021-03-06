// sessionStorage相关操作
export function setStorage (name, content) {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.sessionStorage.setItem(name, content)
}

export function getStorage (name) {
  if (!name) return
  let content = window.sessionStorage.getItem(name)
  try {
    JSON.parse(content)
  } catch (error) {
    return content
  }
  return JSON.parse(content)
}

export function removeStorage (name) {
  if (!name) return
  window.sessionStorage.removeItem(name)
}

export function clearStorage () {
  window.sessionStorage.clear()
}
