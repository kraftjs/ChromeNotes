import { NoteRecord, SyncStorageData } from './types';
import { isValidUrl } from './utils';

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const variableKey = platformInfo.os === 'mac' ? 'Command' : 'Ctrl';
    const title = `ChromeNotes:\n${variableKey}+Shift+F to open extension.`;
    chrome.action.setTitle({ title });
  });
});

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (activeTabInfo) => {
    updateBadgeText(activeTabInfo.url || '');
  });
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    updateBadgeText(changeInfo.url);
  }
});

const updateBadgeText = (url: string) => {
  console.log(url);

  if (!isValidUrl(url)) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  chrome.storage.sync.get('notes', ({ notes }: SyncStorageData) => {
    let badgeText = '';
    if (notes) {
      const currentTabUrl = new URL(url);
      const notesFilteredByUrl = notes.filter((noteRecord: NoteRecord) => {
        const noteUrl = new URL(noteRecord.url);
        return noteUrl.hostname === currentTabUrl.hostname;
      });

      if (notesFilteredByUrl.length > 0) {
        badgeText = notesFilteredByUrl.length.toString();
      }
    }
    chrome.action.setBadgeText({ text: badgeText });
  });
};
