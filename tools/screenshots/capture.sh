#!/bin/zsh
# Regenerate the map-editor tutorial screenshots from the game.
#
#   tools/screenshots/capture.sh            # English, into map-editor-images/
#   LOCALE=de_DE tools/screenshots/capture.sh   # German, into map-editor-images/de_DE/
#
# GAME_DIR points at the Godot project (default: ~/Godot/egg-game). The game opens
# fullscreen for a few minutes; leave the machine alone while it runs.
set -e
HERE=${0:A:h}
DOCS=${HERE:h:h}
GAME_DIR=${GAME_DIR:-$HOME/Godot/egg-game}
LOCALE=${LOCALE:-en_GB}
WORK=$(mktemp -d)
RAW=$WORK/raw
mkdir -p $RAW
if [[ $LOCALE == en_GB ]]; then DEST=$DOCS/map-editor-images; else DEST=$DOCS/map-editor-images/$LOCALE; fi

# The game can write settings and save data while menus are open; put them back afterwards.
USERDIR="$HOME/Library/Application Support/Increpare_Oeuf"
for f in settings.txt savestate.cfg; do [[ -f "$USERDIR/$f" ]] && cp -p "$USERDIR/$f" "$WORK/$f.keep"; done
restore() { for f in settings.txt savestate.cfg; do [[ -f "$WORK/$f.keep" ]] && cp -p "$WORK/$f.keep" "$USERDIR/$f"; done; }
trap restore EXIT

build() { # shots file -> runnable script
  python3 - "$HERE/capture_lib.gd" "$HERE/$1" "$WORK/$1" <<'PY'
import sys
lib, shots, out = sys.argv[1:]
body = open(lib).read().replace("func run() -> void:\n\tpass\n", "", 1)
open(out, "w").write(body + open(shots).read())
PY
}
build editor_shots.gd
build menu_shots.gd
for s in editor_shots.gd menu_shots.gd; do
  OEUF_SHOTS_RAW=$RAW OEUF_DOC_LOCALE=$LOCALE godot --path "$GAME_DIR" --script "$WORK/$s" 2>&1 | grep -E "^saved|SCRIPT ERROR|Parse Error" || true
done
# Post-process into a staging folder, so existing images in DEST are never re-encoded.
zsh $HERE/post.sh $RAW $WORK/final "$GAME_DIR"
mkdir -p $DEST
cp $WORK/final/* $DEST/
echo "$(ls $WORK/final | wc -l | tr -d ' ') images written to $DEST (raw captures in $RAW)"
