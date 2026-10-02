#!/bin/zsh
# Copy the game's own SVG icons into map-editor-images/, recoloured for a light page.
#
#   tools/icons/render_icons.sh        (GAME_DIR defaults to ~/Godot/egg-game)
#
# The editor draws white line icons on dark buttons; the tutorial draws them in plum
# on white. Object and trigger icons are full colour and are copied unchanged.
set -e
HERE=${0:A:h}
DOCS=${HERE:h:h}
GAME_DIR=${GAME_DIR:-$HOME/Godot/egg-game}
OUT=$DOCS/map-editor-images
TOOLBAR=$GAME_DIR/VoxelWorld/Editor/Icons/Toolbar
LAYERS=$GAME_DIR/VoxelWorld/Editor/Icons/Layers
INPUT=$GAME_DIR/VoxelWorld/Editor/Icons/Input
PLUM='#7d4f76'

# White strokes and fills become plum (or another colour).
line_icon() { # source, destination, [colour]
  sed -E "s/\"(white|#fff|#ffffff)\"/\"${3:-$PLUM}\"/g" "$1" > "$OUT/$2"
}

# Block tools, keyed like the toolbar: 1..9, 0.
typeset -A tools
tools=(1 place 2 plane 3 extrude 4 paint 5 grout 6 hollow 7 hill 8 sculpt 9 sphere 0 drawing_plane)
for key name in ${(kv)tools}; do line_icon $TOOLBAR/$name.svg tool_$key.svg; done

line_icon $TOOLBAR/object.svg entity_tool_object.svg
line_icon $TOOLBAR/trigger.svg entity_tool_trigger.svg
line_icon $TOOLBAR/layer_move.svg layer_transform_tool_icon.svg
line_icon $TOOLBAR/layer_assign.svg layer_assignment_tool_icon.svg
line_icon $TOOLBAR/clipboard.svg layer_clipboard.svg
line_icon $TOOLBAR/workshop.svg upload_icon.svg

# Layer-list buttons, plus black eyes for use inside running text.
for name in grip visible merge_up delete new; do line_icon $LAYERS/$name.svg layer_item_$name.svg; done
line_icon $LAYERS/visible.svg layer_item_visible_black.svg '#1d1a24'
line_icon $LAYERS/invisible.svg layer_item_invisible_black.svg '#1d1a24'

# Objects and trigger boxes, numbered in palette order.
i=1
for name in Bonfire Bonfire_Start Bonfire_End Torch Star Chair Table Banana Nest; do
  cp $GAME_DIR/VoxelWorld/Models/OBJECT/$name.svg $OUT/object_${i}_$name.svg; i=$((i + 1))
done
i=1
for name in music arealabel killbox torch advanced; do
  cp $GAME_DIR/VoxelWorld/Editor/Icons/Triggers/Filled/$name.svg $OUT/trigger_${i}_$name.svg; i=$((i + 1))
done

# Mouse buttons for control lists: plum outline, white body, cyan for the pressed part.
for name in mouse_left mouse_right mouse_wheel; do
  sed -e 's/#68e9f3/#2ca7bc/g' -e 's/#231e27/#ffffff/g' -e 's/#f1eaf0/#5a3c56/g' $INPUT/$name.svg > $OUT/$name.svg
done
echo "Icons written to $OUT"
