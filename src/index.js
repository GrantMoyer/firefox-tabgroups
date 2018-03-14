//const self = require("sdk/self");
//const _ = require("sdk/l10n").get;
//
//const {Hotkey} = require("sdk/hotkeys");
//const {Panel} = require("sdk/panel");
//const Prefs = require("sdk/simple-prefs");
//const TabsUtils = require("sdk/tabs/utils");
//const Tabs = require("sdk/tabs");
//const {ToggleButton} = require("sdk/ui/button/toggle");
//const WindowUtils = require("sdk/window/utils");
//
//const Utils = require("lib/utils");
//const {SessionStorage} = require("lib/storage/session");
//const {TabManager} = require("lib/tabmanager");

function TabGroups() {
  this._groupsPanel = null;
  this._hotkeyOpen = null;
  this._hotkeyNextGroup = null;
  this._hotkeyPrevGroup = null;

  this._panelButton = null;

  //this._tabs = new TabManager(new SessionStorage());

  this.init();
  this.bindEvents();
}

TabGroups.prototype = {
  init: function() {
    this.createHotkeys();
  },

  bindEvents: function() {
    // TODO: implement prefrences
    //this.bindGroupPreference();
    this.bindPanelEvents();
    //this.bindTabEvents();
  },

  createHotkeys: function() {
    browser.commands.onCommand.addListener((name) => {
        switch (name) {
          case "switch_group":
            this._tabs.selectNextPrevGroup(
              this._getWindow(),
              this._getTabBrowser(),
              1
            );
            break;
        }
    });
  },

//
//  bindGroupPreference: function() {
//    let emitCloseTimeoutChange = () => {
//      this._groupsPanel.port.emit("Groups:CloseTimeoutChanged", Prefs.prefs.groupCloseTimeout);
//    };
//
//    Prefs.on("groupCloseTimeout", emitCloseTimeoutChange);
//
//    emitCloseTimeoutChange();
//  },
//
  bindPanelEvents: function() {
    browser.runtime.onMessage.addListener((message) => {
      console.log("Background script received message of type " +
                  message.type + " with payload " + message.event);
      switch (message.type) {
        case "Group:Add": this.onGroupAdd(); break;
        case "Group:AddWithTab": this.onGroupAddWithTab(message.event); break
        case "Group:Close": this.onGroupClose(message.event); break;
        case "Group:Rename": this.onGroupRename(message.event); break;
        case "Group:Select": this.onGroupSelect(message.event); break;
        case "Group:Drop": this.onGroupDrop(message.event); break;
        case "Tab:Select": this.onTabSelect(message.event); break;
        case "UI:Resize": this.resizePanel(message.event); break;
      };
    });
  },
//
//  bindTabEvents: function() {
//    Tabs.on("activate", () => {
//      let window = this._getWindow();
//      this._tabs.updateCurrentSelectedTab(window);
//      this._tabs.updateCurrentSelectedGroup(window);
//    });
//    Tabs.on("open", () => {
//      this._tabs.updateCurrentSelectedTab(this._getWindow());
//    });
//  },
//
  refreshUi: function() {
    let groups = this._tabs.getGroupsWithTabs(this._getWindow(), Prefs.prefs.enableAlphabeticSort);

    browser.runtime.sendMessage({type: "Groups:Changed",
                                 tabgroups: groups});
  },

//  resizePanel: function(dimensions) {
//    this._groupsPanel.resize(
//      this._groupsPanel.width,
//      dimensions.height + 18
//    );
//  },

  onGroupAdd: function() {
    //this._tabs.addGroup(
    //  this._getWindow()
    //);
    //this.refreshUi();
  },

  onGroupAddWithTab: function(event) {
    this._tabs.addGroupWithTab(
      this._getWindow(),
      this._getTabBrowser(),
      event.tabIndex
    );
    this.refreshUi();
  },

  onGroupClose: function(event) {
    this._tabs.closeGroup(
      this._getWindow(),
      this._getTabBrowser(),
      event.groupID
    );
    this.refreshUi();
  },

  onGroupRename: function(event) {
    this._tabs.renameGroup(
      this._getWindow(),
      event.groupID,
      event.title
    );
    this.refreshUi();
  },

  onGroupSelect: function(event) {
    this._tabs.selectGroup(
      this._getWindow(),
      this._getTabBrowser(),
      event.groupID
    );
    this.refreshUi();
  },

  onTabSelect: function(event) {
    this._tabs.selectTab(
      this._getWindow(),
      this._getTabBrowser(),
      event.tabIndex,
      event.groupID
    );
    this.refreshUi();
  },

  onGroupDrop: function(event) {
    this._tabs.moveTabToGroup(
      this._getWindow(),
      this._getTabBrowser(),
      event.tabIndex,
      event.targetGroupID
    );
    this.refreshUi();
  },
//
//  _getWindow: function() {
//    return WindowUtils.getMostRecentBrowserWindow();
//  },
//
//  _getTabBrowser: function() {
//    return TabsUtils.getTabBrowser(this._getWindow());
//  }
};

new TabGroups();
