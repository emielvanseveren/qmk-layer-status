# qmk-layer-status
Show qmk layer keyboard status in ubuntu top bar

![img](https://github.com/emielvanseveren/qmk-layer-status/blob/master/images/screenshot.png)

## Development


###
- To update the extension with the new code you've written, you have to restart the X11-session.
  - This can be done with `ALT+F2`, which opens a command prompt
  - `restart` or `r`.

#### Links
- [GJS guide](https://gjs.guide/guides)
- [API Documentation](https://gjs-docs.gnome.org/)
- [Code reference](https://sourcegraph.com/github.com/AnarchyLinux/installer/-/blob/extra/desktop/Anarchy-gnome/.local/share/gnome-shell/extensions/CoverflowAltTab@palatis.blogspot.com)

#### Debug
```bash
# Gnome shell logs.
$ journalctl -f -o cat /usr/bin/gnome-shell
```
