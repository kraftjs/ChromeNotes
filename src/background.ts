import { noteRecord } from './types'

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const variableKey = platformInfo.os === 'mac' ? 'Command' : 'Ctrl';

    const title = `ChromeNotes shortcuts for ${platformInfo.os}:
    ${variableKey}+Shift+F to open extension.
    ${variableKey}+Shift+T to view all notes in new tab.`;

    chrome.action.setTitle({ title });
  });
});

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (activeTabInfo) => {
    updateBadgeText(activeTabInfo.url || '');
  });
});

chrome.tabs.onUpdated.addListener((_, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    updateBadgeText(changeInfo.url);
  }
});

const updateBadgeText = (url: string) => {
  if (!isValidUrl(url)) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  chrome.storage.sync.get('notes', (data) => {
    let badgeText = '';
    if (data.notes) {
      const currentTabUrl = new URL(url);
      const notesFilteredByUrl = data.notes.filter((noteRecord: noteRecord) => {
        const noteRecordUrl = new URL(noteRecord.url);
        return noteRecordUrl.hostname === currentTabUrl.hostname;
      });

      if (notesFilteredByUrl.length > 0) {
        badgeText = notesFilteredByUrl.length.toString();
      }
    }
    chrome.action.setBadgeText({ text: badgeText });
  });
};

const isValidUrl = (url: string) => {
  try {
    new URL(url);
  } catch (error) {
    return false;
  }
  return true;
};
