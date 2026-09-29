## Map-editor screenshots and toolbar icons. Appended to capture_lib.gd by capture.sh.
func run_a() -> void:
	# ---------- UI on small_track ----------
	await load_map("small_track")
	tool(0)
	look(Vector3(-6, 13, 24), Vector3(3, 1, 0))
	await tick()
	await snap("map_editor_opened")
	var tl := Rect2()
	for n in ["action_new", "action_load", "action_save", "action_workshop_upload", "action_undo", "action_redo"]:
		tl = node(n).get_global_rect() if tl.size == Vector2.ZERO else tl.merge(node(n).get_global_rect())
	tl = tl.merge(editor.lineedit_filename.get_global_rect()).grow(6)
	await snap("editor_ui_top_left", tl)
	note("editor_ui_top_left", "filename", editor.lineedit_filename, tl)
	note("editor_ui_top_left", "dropdown", node("action_new").get_parent().find_child("*Dropdown*", true, false) if node("action_new").get_parent().find_child("*Dropdown*", true, false) else editor.lineedit_filename, tl)
	note("editor_ui_top_left", "folder", node("action_load"), tl)
	note("editor_ui_top_left", "upload", node("action_workshop_upload"), tl)
	await snap("workshop_upload", tl)
	note("workshop_upload", "upload", node("action_workshop_upload"), tl)
	# Shape palette.
	var sh: Rect2 = node("piece_cube").get_global_rect()
	for n in ["piece_steps", "piece_fence", "piece_quarter_interior_cap", "piece_rotate", "piece_vflip"]:
		sh = sh.merge(node(n).get_global_rect())
	await snap("shape_toolbar", sh.grow(4))
	# File dropdown.
	var dd = editor.get("dropdown_loadfile")
	if dd:
		dd.show_popup()
		await frames(8)
		var pr: Rect2 = Rect2(editor.dropdown_loadfile_popup.position, editor.dropdown_loadfile_popup.size)
		var fr: Rect2 = pr.merge(tl).grow(6)
		fr.size.y = min(fr.size.y, 620)
		await snap("file_dropdown", fr)
		editor.dropdown_loadfile_popup.hide()

	# ---------- Plane ----------
	var B := Vector3i(100, 0, 0)
	await load_map("minimal")
	stage_floor(B)
	fill(B + Vector3i(0, 1, 20), B + Vector3i(20, 7, 20), GREY_BRICK)
	await frames(8)
	tool(1)
	look(Vector3(105, 12, -7), Vector3(108, 0, 6))
	await at(Vector3(104, 0.5, 4), true, true)
	await at(Vector3(115, 0.5, 13), true)
	look(Vector3(105, 12, -7), Vector3(109, 0, 8))
	await snap("plane_drag_basic")
	editor.abort_all_dragging_states()
	# Ctrl: sink one block into the face.
	look(Vector3(105, 12, -7), Vector3(108, 0, 6))
	key(glob.PRIMARY_MODIFIER, true)
	await at(Vector3(104, 0.5, 4), true, true)
	await at(Vector3(115, 0.5, 13), true)
	look(Vector3(105, 12, -7), Vector3(109, 0, 8))
	await snap("plane_drag_ctrl_flush")
	key(glob.PRIMARY_MODIFIER, false)
	editor.abort_all_dragging_states()
	# Alt: centred on the first click.
	look(Vector3(105, 12, -7), Vector3(110, 0, 10))
	await at(Vector3(110, 0.5, 10), true, true)
	editor._editor_alt_pressed = true
	await at(Vector3(114, 0.5, 13), true)
	look(Vector3(105, 12, -7), Vector3(110, 0, 9))
	await snap("plane_drag_alt_centered")
	editor._editor_alt_pressed = false
	editor.abort_all_dragging_states()
	# Right-drag on the wall: a doorway.
	look(Vector3(110, 5, 6), Vector3(110, 4, 20))
	await at(Vector3(108, 1.5, 19.5), false, false, true, true)
	await at(Vector3(111, 5.5, 19.5), false, false, true)
	look(Vector3(107, 7, 5), Vector3(110, 4, 20))
	await snap("plane_drag_delete_region")
	editor.abort_all_dragging_states()
	# Sloped shape: the sheet follows the slope.
	editor._on_action_blocktype_pressed(1)
	look(Vector3(105, 12, -7), Vector3(108, 0, 6))
	await at(Vector3(104, 0.5, 4), true, true)
	await at(Vector3(112, 0.5, 12), true)
	look(Vector3(100, 10, 2), Vector3(109, 2, 9))
	await snap("slope_plane_drag")
	editor.abort_all_dragging_states()
	editor._on_action_blocktype_pressed(0)

	# ---------- Extrude: an irregular footprint ----------
	B = Vector3i(200, 0, 0)
	await load_map("minimal")
	stage_floor(B)
	for r in [[Vector3i(4, 1, 5), Vector3i(9, 1, 8)], [Vector3i(7, 1, 8), Vector3i(12, 1, 13)], [Vector3i(10, 1, 3), Vector3i(14, 1, 6)], [Vector3i(3, 1, 9), Vector3i(5, 1, 12)]]:
		fill(B + r[0], B + r[1], COBBLE)
	await frames(8)
	tool(2)
	look(Vector3(203, 14, -6), Vector3(206, 1, 5))
	await at(Vector3(203, 1.5, 2), true, true)
	await at(Vector3(215, 1.5, 14), true)
	await at(Vector3(215, 1.5, 14), false, false, false, false, true)
	look(Vector3(203, 14, -6), Vector3(209, 1, 8))
	await at(Vector3(209, 6, 8))
	look(Vector3(200, 12, -8), Vector3(209, 3, 8))
	await snap("extrude_irregular_shape")
	editor.abort_all_dragging_states()

	# ---------- Grout: smooth half a blocky mound, then show the cleanup selection ----------
	B = Vector3i(300, 0, 0)
	await load_map("minimal")
	stage_floor(B)
	for h in 5:
		fill(B + Vector3i(4 + h, 1 + h, 4 + h), B + Vector3i(16 - h, 1 + h, 16 - h), GRASS)
	await frames(8)
	tool(8)
	look(Vector3(303, 16, -5), Vector3(306, 1, 5))
	await at(Vector3(302.5, 0.5, 2.5), true, true)
	await at(Vector3(309.5, 0.5, 17.5), true)
	await at(Vector3(309.5, 0.5, 17.5), false, false, false, false, true)
	await at(Vector3(306, 9, 10))
	await at(Vector3(306, 9, 10), true, true)
	await at(Vector3(306, 9, 10), false, false, false, false, true)
	await frames(10)
	editor.gizmo_manager.clear_editormode()
	look(Vector3(300, 12, -6), Vector3(310, 3, 10))
	await snap("grout_tool_smoothing")
	look(Vector3(303, 16, -5), Vector3(306, 1, 5))
	await at(Vector3(302.5, 0.5, 2.5), false, false, true, true)
	await at(Vector3(309.5, 0.5, 17.5), false, false, true)
	await at(Vector3(309.5, 0.5, 17.5), false, false, false, false, false, true)
	await at(Vector3(306, 9, 10))
	look(Vector3(300, 12, -6), Vector3(310, 3, 10))
	await snap("grout_tool_cleanup")
	editor.abort_all_dragging_states()

	# ---------- Hollow: hollow a solid block, then cut a window to show the shell ----------
	B = Vector3i(400, 0, 0)
	await load_map("minimal")
	stage_floor(B)
	fill(B + Vector3i(5, 1, 6), B + Vector3i(15, 8, 16), RED_BRICK)
	await frames(8)
	tool(3)
	look(Vector3(403, 16, -4), Vector3(410, 8, 11))
	await at(Vector3(405.5, 8.5, 6.5), true, true)
	await at(Vector3(414.5, 8.5, 15.5), true)
	await at(Vector3(414.5, 8.5, 15.5), false, false, false, false, true)
	# Show the depth preview half way down before committing.
	look(Vector3(402, 12, -6), Vector3(410, 5, 11))
	await at(Vector3(410, 1.5, 5.5))
	await at(Vector3(410, 1.5, 5.5), true, true)
	await at(Vector3(410, 1.5, 5.5), false, false, false, false, true)
	await frames(4)
	editor.command_executor.execute({"type": commands.REMOVE_RANGE, "a": B + Vector3i(7, 2, 6), "b": B + Vector3i(13, 7, 6)})
	await frames(8)
	look(Vector3(404, 9, -3), Vector3(410, 4, 11))
	await snap("hollow_tool_example")

	# ---------- Hill ----------
	B = Vector3i(500, 0, 0)
	await load_map("minimal")
	stage_floor(B, GRASS, 30)
	await frames(8)
	tool(5)
	editor.lumpdropper_radius = 5
	editor.lumpdropper_height = 6
	look(Vector3(505, 20, -8), Vector3(512, 0, 10))
	for p in [Vector3(508, 0.5, 9), Vector3(519, 0.5, 14), Vector3(511, 0.5, 20)]:
		await at(p, true, true)
		await at(p, false, false, false, false, true)
		await frames(6)
	editor.lumpdropper_radius = 4
	await at(Vector3(522, 0.5, 6))
	look(Vector3(503, 16, -8), Vector3(514, 2, 12))
	await snap("hill_dropper_example")

	# ---------- Sculpt ----------
	B = Vector3i(600, 0, 0)
	await load_map("minimal")
	stage_floor(B)
	fill(B + Vector3i(5, 1, 5), B + Vector3i(15, 4, 15), STONE)
	fill(B + Vector3i(8, 5, 8), B + Vector3i(12, 7, 12), STONE)
	await frames(8)
	tool(6)
	editor.sculpt_radius = 3
	look(Vector3(603, 15, -5), Vector3(610, 4, 10))
	await at(Vector3(605.5, 4.5, 8), false, false, true, true)
	await at(Vector3(605.5, 4.5, 8), false, false, false, false, false, true)
	await frames(6)
	await at(Vector3(610, 7.5, 10), true, true)
	await at(Vector3(610, 7.5, 10), false, false, false, false, true)
	await frames(6)
	await at(Vector3(614.5, 4.5, 12))
	look(Vector3(602, 13, -6), Vector3(610, 4, 10))
	await snap("sculpt_tool_example")

	# ---------- Sphere ----------
	B = Vector3i(700, 0, 0)
	await load_map("minimal")
	stage_floor(B)
	fill(B + Vector3i(2, 1, 14), B + Vector3i(18, 10, 18), STONE)
	await frames(8)
	tool(7)
	editor.selected_tileset_column = COBBLE.x
	editor.selected_tileset_row = COBBLE.y
	editor.ball_radius = 3
	look(Vector3(706, 8, -4), Vector3(708, 5, 14))
	key(glob.PRIMARY_MODIFIER, true)
	await at(Vector3(707, 5, 13.5), false, false, true, true)
	await at(Vector3(707, 5, 13.5), false, false, false, false, false, true)
	key(glob.PRIMARY_MODIFIER, false)
	await frames(6)
	await at(Vector3(714, 0.5, 6), true, true)
	await at(Vector3(714, 0.5, 6), false, false, false, false, true)
	await frames(6)
	await at(Vector3(703.5, 7, 13.5))
	look(Vector3(702, 11, -6), Vector3(710, 4, 11))
	await snap("sphere_tool_example")

	# ---------- 2D Draw ----------
	B = Vector3i(800, 0, 0)
	await load_map("minimal")
	stage_floor(B, GRASS, 24)
	await frames(8)
	tool(9)
	editor.hplane_dir = glob.D
	editor.hplane_anchor = B + Vector3i(0, 1, 0)
	var spiral := [Vector2i(12, 12), Vector2i(13, 12), Vector2i(13, 13), Vector2i(12, 14), Vector2i(11, 14), Vector2i(10, 13), Vector2i(10, 12), Vector2i(10, 11), Vector2i(11, 10), Vector2i(12, 10), Vector2i(13, 10), Vector2i(14, 10), Vector2i(15, 11), Vector2i(15, 12), Vector2i(15, 13), Vector2i(15, 14), Vector2i(14, 15), Vector2i(13, 16), Vector2i(12, 16), Vector2i(11, 16), Vector2i(10, 16), Vector2i(9, 15), Vector2i(8, 14), Vector2i(8, 13), Vector2i(8, 12), Vector2i(8, 11), Vector2i(8, 10), Vector2i(9, 9), Vector2i(10, 8), Vector2i(11, 8), Vector2i(12, 8), Vector2i(13, 8), Vector2i(14, 8), Vector2i(15, 8), Vector2i(16, 9), Vector2i(17, 10)]
	for c in spiral:
		fill(B + Vector3i(c.x, 1, c.y), B + Vector3i(c.x, 1, c.y), Vector2i(1, 8))
	await frames(8)
	look(Vector3(806, 16, -4), Vector3(812, 1, 11))
	await at(Vector3(818, 1.2, 12))
	look(Vector3(804, 15, -5), Vector3(812, 1, 11))
	await snap("planar_draw_example")

	var f := FileAccess.open(OUT + "rects_a.json", FileAccess.WRITE)
	f.store_string(JSON.stringify(rects, "  "))

func add_object(pos: Vector3i, asset: String, dir := 0, layer := 0) -> void:
	editor.command_executor.execute({"type": commands.ADD_OBJECT, "position": pos, "dir": dir, "asset_name": asset, "layer_idx": layer})
	await frames(2)

func add_trigger(pos: Vector3i, radii: Vector3i, preset: String, meta: String, layer := 0) -> void:
	editor.command_executor.execute({"type": commands.ADD_TRIGGER_WITH_PRESET, "position": pos, "side": glob.U, "radii": radii, "preset_name": preset, "preset_meta": meta, "layer_idx": layer})
	await frames(2)

func select_at(pos: Vector3i) -> void:
	var idx: int = editor.entity_manager.entity_idx_at(pos)
	editor.selected_entity_id = idx
	editor.entity_manager.draw_selected_box(idx)
	editor._sync_resize_preview_from_selected_entity()
	editor.update_UI()
	await frames(4)

func inspector_rect() -> Rect2:
	return node("PropertyPanel").get_global_rect()

## Crop from the left edge of a scene area to the inspector's right edge.
func scene_and_inspector(left: float, top: float) -> Rect2:
	var ir := inspector_rect()
	return Rect2(Vector2(left, top), ir.end - Vector2(left, top)).grow(6)

func row_rect(row_name: String) -> Rect2:
	var n: Control = node("PropertyPanel").find_child(row_name, true, false)
	return n.get_global_rect() if n else Rect2()

func note_rect(shot_name: String, label: String, r: Rect2, crop: Rect2) -> void:
	var scale := Vector2(3024, 1898) / root.get_viewport().get_visible_rect().size
	r.position -= crop.position
	if not rects.has(shot_name):
		rects[shot_name] = {}
	rects[shot_name][label] = [r.position.x * scale.x, r.position.y * scale.y, r.size.x * scale.x, r.size.y * scale.y]

func run_b() -> void:
	# ---------- Entity scene ----------
	var B := Vector3i(1000, 0, 0)
	await load_map("minimal")
	stage_floor(B, GRASS, 24)
	fill(B + Vector3i(3, 0, 3), B + Vector3i(20, 0, 5), COBBLE)
	fill(B + Vector3i(10, 0, 5), B + Vector3i(12, 0, 20), COBBLE)
	await frames(6)
	editor.set_editor_mode(1)
	editor.entity_tool_selected = editor.EntityType.OBJECT
	editor.update_UI()
	await add_object(B + Vector3i(4, 1, 4), "Bonfire_Start.tscn", 1)
	await add_object(B + Vector3i(11, 1, 12), "Bonfire.tscn", 1)
	await add_object(B + Vector3i(19, 1, 4), "Bonfire_End.tscn", 3)
	await add_object(B + Vector3i(8, 1, 7), "Torch.tscn")
	await add_object(B + Vector3i(15, 1, 8), "Star.tscn")
	await add_object(B + Vector3i(5, 1, 14), "Chair.tscn", 1)
	await add_object(B + Vector3i(6, 1, 16), "Table.tscn")
	await add_object(B + Vector3i(16, 1, 15), "Banana.tscn")
	await add_object(B + Vector3i(19, 1, 19), "Nest.tscn")
	editor.selected_entity_id = -1
	editor.entity_manager.draw_selected_box(-1)
	editor.update_UI()
	await frames(6)
	look(Vector3(1003, 14, -8), Vector3(1012, 1, 11))
	await tick()
	await snap("entity_mode")

	hide_entity_gizmo = true
	# Start-Checkpoint with its inspector.
	await select_at(B + Vector3i(4, 1, 4))
	look(Vector3(1000.5, 4.5, -1.5), Vector3(1004, 1.2, 4))
	await snap("start_checkpoint", scene_and_inspector(560, 300))
	# Star with its inspector.
	await select_at(B + Vector3i(15, 1, 8))
	look(Vector3(1011.5, 4, 2.5), Vector3(1015, 1.2, 8))
	await snap("star_props", scene_and_inspector(560, 300))
	# Close-ups of the inert props, each selected.
	var closeups := {"Torch": [Vector3i(8, 1, 7), Vector3(1003, 5, 0)], "Chair": [Vector3i(5, 1, 14), Vector3(1000, 5, 8)], "Table": [Vector3i(6, 1, 16), Vector3(1001, 5, 10)], "Banana": [Vector3i(16, 1, 15), Vector3(1011, 5, 9)], "Nest": [Vector3i(19, 1, 19), Vector3(1013, 6, 12)]}
	for k in closeups:
		var p: Vector3i = B + closeups[k][0]
		await select_at(p)
		look(closeups[k][1].lerp(Vector3(p), 0.3), Vector3(p) + Vector3(0, 0.3, 0))
		await snap("object_%s_example" % k.to_lower(), Rect2(560, 250, 800, 640))

	hide_entity_gizmo = false
	# ---------- Trigger boxes ----------
	editor.entity_tool_selected = editor.EntityType.TRIGGER
	editor.update_UI()
	await frames(4)
	await add_trigger(B + Vector3i(4, 1, 8), Vector3i(3, 3, 3), "music_", "music_Sacred_Spring")
	await add_trigger(B + Vector3i(15, 1, 12), Vector3i(4, 3, 3), "arealabel_", "arealabel_MOUNTAIN_PASS")
	await add_trigger(B + Vector3i(21, 1, 12), Vector3i(2, 2, 5), "KILLBOX", "KILLBOX")
	# A plain trigger box, selected.
	await select_at(B + Vector3i(4, 1, 8))
	look(Vector3(998, 9, -2), Vector3(1004, 2, 8))
	await snap("triggerbox")
	await snap("trigger_intro", scene_and_inspector(760, 280))
	var crop := inspector_rect().grow(8)
	await snap("music_property_panel", crop)
	note_rect("music_property_panel", "track", row_rect("Track"), crop)
	await select_at(B + Vector3i(15, 1, 12))
	crop = inspector_rect().grow(8)
	await snap("arealabel_props", crop)
	note_rect("arealabel_props", "name", row_rect("DisplayName"), crop)
	await select_at(B + Vector3i(21, 1, 12))
	look(Vector3(1014, 9, 2), Vector3(1021, 2, 12))
	await snap("killbox", scene_and_inspector(700, 250))

	# Resize animation: drag the east face out and back.
	await select_at(B + Vector3i(4, 1, 8))
	look(Vector3(998, 9, -2), Vector3(1004, 2, 8))
	var gif_frames := 0
	for e in [3, 4, 5, 6, 7, 7, 6, 5, 4, 3, 3]:
		editor.command_executor.execute({"type": commands.VOLUME_EXTENTS_CHANGED, "position": B + Vector3i(4, 1, 8), "size_WUN": Vector3i(2, 2, 2), "size_EDS": Vector3i(e - 1, 0, 2)})
		editor._sync_resize_preview_from_selected_entity()
		await frames(2)
		await snap("resize_frame_%02d" % gif_frames, Rect2(420, 200, 1080, 760))
		gif_frames += 1

	# ---------- Layers ----------
	B = Vector3i(1100, 0, 0)
	await load_map("minimal")
	editor.set_editor_mode(2)
	for n in ["ground", "house", "tower", "bridge", "unused"]:
		editor.command_executor.execute({"type": commands.ADD_LAYER, "layer_name": n})
	await frames(4)
	stage_floor(B, GRASS, 24)
	fill(B + Vector3i(0, 0, 0), B + Vector3i(24, 0, 24), GRASS, -1, 0, 1)
	fill(B + Vector3i(3, 1, 12), B + Vector3i(10, 5, 19), RED_BRICK, -1, 0, 2)
	fill(B + Vector3i(4, 6, 13), B + Vector3i(9, 6, 18), PLANKS, -1, 0, 2)
	fill(B + Vector3i(16, 1, 14), B + Vector3i(19, 12, 17), GREY_BRICK, -1, 0, 3)
	fill(B + Vector3i(11, 5, 15), B + Vector3i(15, 5, 16), PLANKS, -1, 0, 4)
	editor.selected_layer_idx = 2
	editor.update_layerlist_ui()
	await frames(6)
	await snap("layer_list_view", node("Layer_Container").get_parent().get_global_rect().grow(6))
	# Assignment: drag a box over the house.
	editor._on_layer_mode_button_pressed(editor.LayerToolType.VOLUME)
	editor.selected_layer_idx = 5
	editor.update_layerlist_ui()
	look(Vector3(1104, 16, -6), Vector3(1106, 1, 10))
	await at(Vector3(1102.5, 0.5, 10.5), true, true)
	await at(Vector3(1111.5, 0.5, 20.5), true)
	await at(Vector3(1111.5, 0.5, 20.5), false, false, false, false, true)
	await at(Vector3(1106.5, 5, 11.6))
	look(Vector3(1101, 14, -4), Vector3(1108, 3, 14))
	await snap("layer_assignment_example")
	editor.abort_all_dragging_states()
	# Clipboard: copy the house, then hover where it would be pasted.
	editor._on_layer_mode_button_pressed(editor.LayerToolType.LAYER_CLIPBOARD)
	look(Vector3(1104, 16, -6), Vector3(1106, 3, 15))
	await at(Vector3(1106, 3, 11.5), true, true)
	await at(Vector3(1106, 3, 11.5), false, false, false, false, true)
	look(Vector3(1098, 18, -8), Vector3(1116, 1, 4))
	await tick()
	await snap("layer_copy_paste_example")

	# Transform: select the tower layer; the gizmo appears.
	editor._on_layer_mode_button_pressed(editor.LayerToolType.GIZMO)
	look(Vector3(1104, 16, -6), Vector3(1013 + 100, 5, 14))
	await at(Vector3(1117.5, 8, 13.5), true, true)
	await at(Vector3(1117.5, 8, 13.5), false, false, false, false, true)
	await frames(6)
	look(Vector3(1102, 15, -6), Vector3(1112, 4, 14))
	await snap("layer_transform_example")
	# Visibility: shift-click the house's eye, hiding the others.
	editor.command_executor.execute({"type": commands.LAYER_VISIBILITY, "layer_index": 2, "visible": true, "shift_pressed": true})
	editor.update_layerlist_ui()
	await frames(6)
	look(Vector3(1102, 15, -6), Vector3(1112, 4, 14))
	await snap("layer_visibility_example")
	editor.command_executor.execute({"type": commands.LAYER_VISIBILITY, "layer_index": 2, "visible": true, "shift_pressed": true})
	editor.update_layerlist_ui()
	# ---------- Diff ----------
	await load_map("small_track")
	editor.open_level_diff_panel()
	await frames(4)
	var diff: Control = editor.level_diff_panel
	diff.get_node("%LineEdit_Before").text = "Oeuf Country v2"
	diff.get_node("%LineEdit_After").text = "Oeuf Country v19"
	diff.get_node("%LineEdit_Before").release_focus()
	var dr: Rect2 = diff.get_global_rect()
	for c in diff.find_children("*", "Control", true, false):
		if c.is_visible_in_tree():
			dr = dr.merge(c.get_global_rect())
	await snap("diff", dr.grow(8))
	diff._on_make_diff_pressed()
	for i in 600:
		await process_frame
		if not diff.visible:
			break
	await frames(30)
	await prepare()
	editor.set_editor_mode(2)
	editor.update_layerlist_ui()
	await frames(6)
	await snap("diff_layers", node("Layer_Container").get_parent().get_global_rect().grow(6))
	await snap("diff_scene")

	var f := FileAccess.open(OUT + "rects_b.json", FileAccess.WRITE)
	f.store_string(JSON.stringify(rects, "  "))


func run() -> void:
	await run_a()
	await run_b()
