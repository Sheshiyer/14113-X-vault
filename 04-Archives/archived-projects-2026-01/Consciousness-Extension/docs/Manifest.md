# Chrome Extension Manifest

## manifest.json
```json
{
  "manifest_version": 3,
  "name": "Consciousness Extension",
  "version": "1.0.0",
  "description": "Reality filtering and consciousness optimization",
  
  "permissions": [
    "storage",
    "tabs",
    "webRequest",
    "notifications"
  ],
  
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "css": ["styles.css"]
    }
  ],
  
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/16.png",
      "32": "icons/32.png",
      "48": "icons/48.png",
      "128": "icons/128.png"
    }
  },
  
  "icons": {
    "16": "icons/16.png",
    "32": "icons/32.png",
    "48": "icons/48.png",
    "128": "icons/128.png"
  }
}
```

## Permissions Usage
- storage: Pattern storage and user preferences
- tabs: Content analysis and pattern recognition
- webRequest: Field coherence monitoring
- notifications: Consciousness updates

## Background Service
- Pattern monitoring
- Field coherence maintenance
- Update management
- API integration

## Content Scripts
- Reality filter implementation
- Pattern recognition
- Field presence interface
- DOM manipulation