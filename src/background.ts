import { NoteRecord, SyncStorageData, EventMessages } from './types';

chrome.runtime.onInstalled.addListener(() => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const variableKey = platformInfo.os === 'mac' ? 'Command' : 'Ctrl';
    const title = `ChromeNotes:\n${variableKey}+Shift+F to open extension.`;
    chrome.action.setTitle({ title });
  });
});

chrome.runtime.onMessage.addListener((message) => {
  if (message === EventMessages.NoteChange) {
    chrome.tabs.query(
      { active: true, windowId: chrome.windows.WINDOW_ID_CURRENT },
      (tabs) => {
        updateBadgeText(tabs[0].url || '');
      },
    );
  }
});

chrome.tabs.onActivated.addListener((tab) => {
  chrome.tabs.get(tab.tabId, (activeTabInfo) => {
    const currentUrl = activeTabInfo.url || '';
    updateBadgeText(currentUrl);
    chrome.runtime.sendMessage(EventMessages.UpdateUrl);
  });
});

chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.url && tab.active) {
    updateBadgeText(changeInfo.url);
    chrome.runtime.sendMessage(EventMessages.UpdateUrl);
  }
});

function updateBadgeText(url: string) {
  if (!isValidUrl(url)) {
    chrome.action.setBadgeText({ text: '' });
    return;
  }

  chrome.storage.sync.get(null, (data: SyncStorageData) => {
    let badgeText = '';
    if (data) {
      const notes = Object.values(data);
      const currentTabUrl = new URL(url);
      const notesFilteredByUrl = notes.filter((noteRecord: NoteRecord) => {
        if (!noteRecord.url) {
          return false;
        }
        const noteUrl = new URL(noteRecord.url);
        return noteUrl.hostname === currentTabUrl.hostname;
      });

      if (notesFilteredByUrl.length > 0) {
        badgeText = notesFilteredByUrl.length.toString();
      }
    }
    chrome.action.setBadgeText({ text: badgeText });
  });
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
  } catch (error) {
    return false;
  }
  return true;
}
