import defaultSettings from '@/settings'

const title = defaultSettings.title

export default function getPageTitle(key) {
  const pageName = key;
  if (pageName) {
    return `${title} - ${pageName}`
  }
  return `${title}`
}
