#!/bin/zsh
# Turn raw captures into documentation images.
# Crops and annotation positions assume a 3024x1898 capture (a 16:10 Retina screen);
# check them if you capture on a different display or in a language with longer labels.
set -e
# Usage: post.sh RAW_DIR OUT_DIR GAME_DIR
IN=$1
OUT=$2
ICONS=$3/VoxelWorld/Editor/Icons/Layers
mkdir -p $OUT
BG='#4d4d4d'

# Scene demos: crop to the viewport (hint panel included, console excluded), then shrink.
# Canvas (1920x1205) to pixels (3024x1898) is x1.575.
scene_crop() { magick $IN/$1.png -crop 2425x1315+158+299 +repage -resize 1600x $OUT/$1.png; }
layer_crop() { magick $IN/$1.png -crop 2851x1315+158+299 +repage -resize 1600x $OUT/$1.png; }
for f in plane_drag_basic plane_drag_ctrl_flush plane_drag_alt_centered plane_drag_delete_region slope_plane_drag \
         extrude_irregular_shape grout_tool_smoothing grout_tool_cleanup hollow_tool_example hill_dropper_example \
         sculpt_tool_example sphere_tool_example planar_draw_example triggerbox; do
  scene_crop $f
done
for f in layer_transform_example layer_visibility_example layer_assignment_example layer_copy_paste_example; do
  layer_crop $f
done
# Whole-screen views.
for f in map_editor_opened entity_mode; do magick $IN/$f.png -resize 1600x $OUT/$f.png; done
# Already-cropped views.
for f in start_checkpoint star_props trigger_intro killbox shape_toolbar layer_list_view diff diff_layers file_dropdown \
         object_torch_example object_chair_example object_table_example object_banana_example object_nest_example; do
  magick $IN/$f.png -resize '1600x>' $OUT/$f.png
done
# Top-left toolbar, from a frame on "minimal" (unsaved, so it shows the asterisk).
magick $IN/plane_drag_basic.png -crop 928x102+16+16 +repage $OUT/_tl.png
# Hand-drawn-style yellow rings: map name, file dropdown, maps folder.
magick $OUT/_tl.png -gravity north -background $BG -extent 948x122 \
  -fill none -stroke '#ffd400' -strokewidth 5 \
  -draw "ellipse 228,61 128,40 0,360" -draw "ellipse 360,61 24,30 0,360" -draw "ellipse 445,61 44,48 0,360" \
  $OUT/editor_ui_top_left.png
# Red underline for the Steam Workshop button.
magick $OUT/_tl.png -gravity north -background $BG -extent 948x130 \
  -fill none -stroke '#ff2020' -strokewidth 7 \
  -draw "path 'M 660,112 Q 680,104 700,112 T 740,112'" \
  $OUT/workshop_upload.png
rm $OUT/_tl.png
# Red rings around the relevant inspector rows.
magick $IN/music_property_panel.png -fill none -stroke '#ff2020' -strokewidth 5 -draw "ellipse 381,518 372,40 0,360" $OUT/music_property_panel.png
magick $IN/arealabel_props.png -fill none -stroke '#ff2020' -strokewidth 5 -draw "ellipse 381,518 372,40 0,360" $OUT/arealabel_props.png

# Resizing a trigger box.
magick -delay 14 -loop 0 $IN/resize_frame_*.png -resize 640x -layers Optimize $OUT/resize_trigger.gif

# Menus.
if [[ -f $IN/m_title.png ]]; then
  magick $IN/m_title.png -resize 1600x $OUT/custom_maps_menu.png
  magick $IN/m_settings.png -resize 1600x $OUT/settings_menu.png
  magick $IN/m_levels.png -resize 1600x $OUT/custom_level_list.png
  magick $IN/m_levels_workshop.png -resize 1600x $OUT/map_in_list.png
  magick $IN/m_levels_local.png -resize 1600x $OUT/open_maps_folder_button.png
  # Host page, with the co-op editing row ringed.
  magick $IN/m_host.png -crop 2170x1570+425+165 +repage -fill none -stroke '#ff2020' -strokewidth 7 \
    -draw "ellipse 560,992 560,62 0,360" -resize 1400x $OUT/coop_editing.png
fi

# Keep the repository light.
pngquant --force --skip-if-larger --quality 70-95 --ext .png $OUT/*.png || true
ls $OUT | wc -l
du -sh $OUT
