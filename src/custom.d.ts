/**
 * NOTE: Included this custom types documentation for chrome.action api, which was updated
 * in manifest v3 for chrome extensions. It has not yet been accepted by the DefinitelyTyped
 * github repo, so I had to copy the pull request with the relevant types found at:
 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/50746/files
 **/

////////////////////
// Action API
////////////////////
/**
 * Use actions to put icons in the main Google Chrome toolbar, to the right of the address bar. Actions can be set to take action on all pages (default_state: enabled) or only the current page (default_state: disabled). If an action is default disabled, the action appears grayed out when inactive. In addition to its icon, an action can also have a tooltip, a badge, and a popup.
 * Availability: Since Chrome 88.
 * Manifest:  "action": {...}
 */
declare namespace chrome.action {
  export interface BadgeBackgroundColorDetails {
    /** An array of four integers in the range [0,255] that make up the RGBA color of the badge. For example, opaque red is [255, 0, 0, 255]. Can also be a string with a CSS value, with opaque red being #FF0000 or #F00. */
    color: string | ColorArray;
    /** Optional. Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.  */
    tabId?: number;
  }

  export interface BadgeTextDetails {
    /** Any number of characters can be passed, but only about four can fit in the space. */
    text: string;
    /** Optional. Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.  */
    tabId?: number;
  }

  export type ColorArray = [number, number, number, number];

  export interface TitleDetails {
    /** The string the browser action should display when moused over. */
    title: string;
    /** Optional. Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.  */
    tabId?: number;
  }

  export interface TabDetails {
    /** Optional. Specify the tab to get the information. If no tab is specified, the non-tab-specific information is returned.  */
    tabId?: number;
  }

  export interface TabIconDetails {
    /** Optional. Either a relative image path or a dictionary {size -> relative image path} pointing to icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals scale, then image with size scale * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.path = foo' is equivalent to 'details.imageData = {'19': foo}'  */
    path?: any;
    /** Optional. Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.  */
    tabId?: number;
    /** Optional. Either an ImageData object or a dictionary {size -> ImageData} representing icon to be set. If the icon is specified as a dictionary, the actual image to be used is chosen depending on screen's pixel density. If the number of image pixels that fit into one screen space unit equals scale, then image with size scale * 19 will be selected. Initially only scales 1 and 2 will be supported. At least one image must be specified. Note that 'details.imageData = foo' is equivalent to 'details.imageData = {'19': foo}'  */
    imageData?: ImageData | { [index: number]: ImageData };
  }

  export interface PopupDetails {
    /** Optional. Limits the change to when a particular tab is selected. Automatically resets when the tab is closed.  */
    tabId?: number;
    /** The html file to show in a popup. If set to the empty string (''), no popup is shown. */
    popup: string;
  }

  export interface ActionClickedEvent
    extends chrome.events.Event<(tab: chrome.tabs.Tab) => void> {}
  /**
   * Since Chrome 88.
   * Disables the action for a tab.
   * @param tabId The id of the tab for which you want to modify the action.
   * @param callback Supported since Chrome 88.
   */
  export function disable(tabId?: number, callback?: () => void): void;
  /**
   * Since Chrome 88.
   * Enables the action for a tab. By default, actions are enabled.
   * @param tabId The id of the tab for which you want to modify the action.
   * @param callback Supported since Chrome 88.
   */
  export function enable(tabId?: number, callback?: () => void): void;
  /**
   * Since Chrome 88.
   * Gets the background color of the action.
   * @param callback The callback parameter should be a function that looks like this:
   * (result: ColorArray) => {...};
   */
  export function getBadgeBackgroundColor(
    details: TabDetails,
    callback: (result: ColorArray) => void,
  ): void;
  /**
   * Since Chrome 88.
   * Gets the badge text of the action. If no tab is specified, the non-tab-specific badge text is returned. If displayActionCountAsBadgeText is enabled, a placeholder text will be returned unless the declarativeNetRequestFeedback permission is present or tab-specific badge text was provided.
   * @param callback Supported since Chrome 88.
   */
  export function getBadgeText(
    details: TabDetails,
    callback: (result: string) => void,
  ): void;
  /**
   * Since Chrome 88.
   * Gets the html document set as the popup for this action.
   * @param callback The callback parameter should be a function that looks like this:
   * (result: string) => {...};
   */
  export function getPopup(
    details: TabDetails,
    callback: (result: string) => void,
  ): void;
  /**
   * Since Chrome 88.
   * Gets the title of the action.
   * @param callback The callback parameter should be a function that looks like this:
   * (result: string) => {...};
   */
  export function getTitle(
    details: TabDetails,
    callback: (result: string) => void,
  ): void;
  /**
   * Since Chrome 88.
   * Sets the background color for the badge.
   * @param callback Supported since Chrome 88.
   */
  export function setBadgeBackgroundColor(
    details: BadgeBackgroundColorDetails,
    callback?: () => void,
  ): void;
  /**
   * Since Chrome 88.
   * Sets the badge text for the action. The badge is displayed on top of the icon.
   * @param callback Supported since Chrome 88.
   */
  export function setBadgeText(
    details: BadgeTextDetails,
    callback?: () => void,
  ): void;
  /**
   * Since Chrome 88.
   * Sets the icon for the action. The icon can be specified either as the path to an image file or as the pixel data from a canvas element, or as dictionary of either one of those. Either the path or the imageData property must be specified.
   * @param callback If you specify the callback parameter, it should be a function that looks like this:
   * () => {...};
   */
  export function setIcon(details: TabIconDetails, callback?: Function): void;
  /**
   * Since Chrome 88.
   * Sets the html document to be opened as a popup when the user clicks on the action's icon.
   * @param callback Supported since Chrome 88.
   */
  export function setPopup(details: PopupDetails, callback?: () => void): void;
  /**
   * Since Chrome 88.
   * Sets the title of the action. This shows up in the tooltip.
   * @param callback Supported since Chrome 88.
   */
  export function setTitle(details: TitleDetails, callback?: () => void): void;
  /** Fired when a action icon is clicked. This event will not fire if the action has a popup. */
  export var onClicked: ActionClickedEvent;
}
