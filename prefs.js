'use strict';

const Gio = imports.gi.Gio;
const Gtk = imports.gi.Gtk;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

function buildPrefsWidget() {

  // Copy the same GSettings code from `extension.js`
  this.settings = ExtensionUtils.getSettings(
    'org.gnome.shell.extensions.qmk-layer-status');

  // Create a parent widget that we'll return from this function
  let prefsWidget = new Gtk.Grid({
    margin: 18,
    column_spacing: 12,
    row_spacing: 12,
    visible: true
  });

  // Add a simple title and add it to the prefsWidget
  let title = new Gtk.Label({
    label: `<b>qmk-layer-status Preferences</b>`,
    halign: Gtk.Align.START,
    use_markup: true,
    visible: true
  });
  prefsWidget.attach(title, 0, 0, 2, 1);

  // Create a label & switch for `show-indicator`
  const toggleLabel = new Gtk.Label({
    label: 'Show Extension Indicator:',
    halign: Gtk.Align.START,
    visible: true
  });

  prefsWidget.attach(toggleLabel, 0, 1, 1, 1);

  let toggle = new Gtk.Switch({
    active: this.settings.get_boolean('show-indicator'),
    halign: Gtk.Align.END,
    visible: true
  });
  prefsWidget.attach(toggle, 1, 1, 1, 1);

  // Bind the switch to the `show-indicator` key
  this.settings.bind(
    'show-indicator',
    toggle,
    'active',
    Gio.SettingsBindFlags.DEFAULT
  );

  // Return our widget which will be added to the window
  return prefsWidget;
}