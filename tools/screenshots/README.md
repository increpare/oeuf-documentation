# Tutorial screenshots

`capture.sh` regenerates the map-editor tutorial's screenshots and toolbar icons
from the game itself, so they can be refreshed when the editor changes, or
captured in another language for a translated tutorial.

```sh
npm run screenshots                       # English, into map-editor-images/
LOCALE=fr_FR tools/screenshots/capture.sh # French, into map-editor-images/fr_FR/
```

`GAME_DIR` points at the Godot project (default `~/Godot/egg-game`); `godot` must be
on the `PATH`. The game opens fullscreen for about six minutes; leave the machine
alone while it runs.

## What it does

- `capture_lib.gd` boots the editor, forces the chosen language in memory, and
  provides helpers for staging scenes, aiming tools and cropping the frame.
  Mac key labels (Cmd/Option, ⌘) are shown as Ctrl/Alt, as most readers see them.
- `editor_shots.gd` stages each demo scene on the built-in `minimal` map (edits are
  in memory only) and drives the tools into their preview states.
- `menu_shots.gd` captures the title screen, Custom Maps tabs, settings and the
  multiplayer Host page, with player and room names replaced by neutral ones.
- `post.sh` crops, adds the red/yellow annotation rings, builds `resize_trigger.gif`,
  and compresses the results.

Heading and mouse icons aren't screenshots: `tools/icons/render_icons.sh` (`npm run icons`)
copies the game's SVGs and recolours them for the page.

Save data is not written (`SaverLoader` writes are disabled), and `capture.sh`
restores `settings.txt` and `savestate.cfg` afterwards in case a menu saves them.

## Maps it expects

`minimal` is built in. The overview uses `small_track`, and the diff screenshots
compare `Oeuf Country v2` with `Oeuf Country v19`; these three are user maps, so on
another machine substitute maps you have.

## Not captured

Steam pages, in-game moments (star collection, area labels, the ILLUMINATION glow) and
the co-op permissions list need a live game or multiplayer session; those images
are kept as they are.

Crop and annotation coordinates assume a 3024×1898 capture (a 16:10 Retina
screen). Check them on a different display, or in a language whose labels are
much longer than English.
