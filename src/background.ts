import { noteRecord } from './types'

chrome.commands.onCommand.addListener((command) => {
  if (command === 'view_all_notes') {
    chrome.tabs.create({ url: chrome.runtime.getURL('display.html') });
  } else if (command === 'create_new_note') {
    // todo: add event listener to open new note
  }
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

chrome.runtime.onInstalled.addListener(() => updateTooltipText());
chrome.runtime.onStartup.addListener(() => updateTooltipText());

const updateTooltipText = () => {
  chrome.runtime.getPlatformInfo((platformInfo) => {
    const variableKey = platformInfo.os === 'mac' ? 'Command' : 'Ctrl';

    const title = `ChromeNotes shortcuts for ${platformInfo.os}:
    ${variableKey}+Shift+F to create a new note.
    Alt+Shift+F to open extension popup.
    Alt+Shift+P to view all notes in a new tab.`;

    chrome.browserAction.setTitle({ title });
  });
};

const updateBadgeText = (url: string) => {
  if (!isValidUrl(url)) {
    chrome.browserAction.setBadgeText({ text: '' });
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
    chrome.browserAction.setBadgeText({ text: badgeText });
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
