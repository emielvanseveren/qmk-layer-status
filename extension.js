'use strict';

// -*- mode: js; js-indent-level: 4; indent-tabs-mode: nil -*-
const ByteArray = imports.byteArray
const Clutter = imports.gi.Clutter;
const Gio = imports.gi.Gio;
const Lang = imports.lang;
const Meta = imports.gi.Meta;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;
const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const INDICATOR_ICON = 'keyboard.svg';

const LayerStatusIndicator = new Lang.Class({
    Name: 'LayerStatusIndicator',
    Extends: PanelMenu.Button,

    _init: function () {
        this.parent(0.0, "LayerStatusIndicator");

        this._layerMonitor = null
        this._layerMonitorConnection = null;

        const hbox = new St.BoxLayout({ style_class: 'panel-status-menu-box layer-indicator-hbox' });
        this.icon = new St.Icon({
            gicon: Gio.icon_new_for_string(`${Me.path}/icons/${INDICATOR_ICON}`),
            style_class: 'system-status-icon',
            icon_size: 24
        });
        hbox.add_child(this.icon);

        this._buttonText = new St.Label({
            text: _('Loading...'),
            y_align: Clutter.ActorAlign.CENTER,
            style_class: 'layer'
        });
        hbox.add_child(this._buttonText);
        this.add_child(hbox);

        const file = Gio.File.new_for_path(`${Me.path}/state/layer`);
        if (file.query_exists(null)) { // Set initial layer (before file detects a change)
            const [ok, contents] = file.load_contents(null);
            if (ok) this._updateButtonText(ByteArray.toString(contents))
        }
        this._layerMonitor = file.monitor(Gio.FileMonitorFlags.NONE, null);
        this._layerMonitorConnection = this._layerMonitor.connect('changed', Lang.bind(this, this._onLayerChanged));
    },

    destroy: function () {
        if (this._layerMonitor) {
            this._layerMonitor.disconnect(this._layerMonitorConnection);
            this._layerMonitor.cancel();
            this._layerMonitor = null;
            this._layerMonitorConnection = null;
        }
    },

    _onLayerChanged: function (_file, other_file, _event_type) {
        try {
            other_file.load_contents_async(null, (file, res) => {
                const [ok, contents] = file.load_contents_finish(res);
                if (ok) this._updateButtonText(ByteArray.toString(contents));
            });
        } catch (e) {
            debug(e);
        }
    },
    _updateButtonText: function (content) {
        if (!content || this._buttonText.text === content) return;
        this._buttonText.set_text(content);
    },
})

let layerStatusIndicator;
function init() {
    log(`initializing ${Me.metadata.name}`);
}
function enable() {
    layerStatusIndicator = new LayerStatusIndicator();
    Main.panel.addToStatusArea('layerStatusIndicator', layerStatusIndicator);
}
function disable() {
    layerStatusIndicator.destroy();
    log(`disabling ${Me.metadata.name}`);
}