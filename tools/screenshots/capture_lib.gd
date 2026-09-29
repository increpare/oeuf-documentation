extends SceneTree
## Shared helpers for scripted documentation screenshots. Edits are in memory only.
## capture.sh appends editor_shots.gd or menu_shots.gd to this file and runs it with Godot.

## Raw captures go here (set by capture.sh).
var OUT: String = OS.get_environment("OEUF_SHOTS_RAW").path_join("")
## Language of the screenshots, whatever the machine's saved setting is.
var LOCALE: String = OS.get_environment("OEUF_DOC_LOCALE") if OS.get_environment("OEUF_DOC_LOCALE") != "" else "en_GB"
var editor: Node
var commands: Dictionary
var shapes: Node
var glob: Node

# Textures (column, page) from the atlas.
const GRASS := Vector2i(4, 0)
const GREY_BRICK := Vector2i(0, 2)
const COBBLE := Vector2i(1, 2)
const RED_BRICK := Vector2i(5, 2)
const PLANKS := Vector2i(7, 1)
const STONE := Vector2i(2, 5)
const DIRT := Vector2i(2, 1)

var physics_runner: PhysicsCalls

class PhysicsCalls extends Node:
	signal finished
	var action: Callable
	func _physics_process(_delta: float) -> void:
		if action.is_valid():
			var pending := action
			action = Callable()
			pending.call()
			finished.emit()

## Run action inside a physics step, where space queries are allowed.
func in_physics(action: Callable) -> void:
	physics_runner.action = action
	await physics_runner.finished

func _initialize() -> void:
	_boot.call_deferred()

func frames(n: int) -> void:
	for i in n:
		await process_frame

func _boot() -> void:
	physics_runner = PhysicsCalls.new()
	root.add_child(physics_runner)
	root.get_node("SaverLoader")._save_writes_allowed = false
	shapes = root.get_node("Shapes")
	glob = root.get_node("Glob")
	commands = load("res://VoxelWorld/Editor/Scripts/EditorCommandExecutor.gd").CommandType
	# Screenshots are in English whatever this machine's saved language is (in memory only).
	var settings = root.get_node("SettingsManager")
	settings.settings_values["LANGUAGE"] = LOCALE
	TranslationServer.set_locale(LOCALE)
	change_scene_to_file("res://VoxelWorld/Editor/Scenes/TestLevel.tscn")
	await scene_changed
	editor = root.get_node("ModeManager").editor_node
	while editor.voxel_world.loading || editor.player == null:
		await process_frame
	if has_method("menus_only"):
		TranslationServer.set_locale(LOCALE)
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
		await frames(60)
		await call("menus_only")
		quit(0)
		return
	editor.title_screen.hide()
	editor.title_screen.process_mode = Node.PROCESS_MODE_DISABLED
	if root.get_node("ModeManager").mode != root.get_node("ModeManager").MODE_EDITOR:
		editor.player.turn_on_level_editor()
	TranslationServer.set_locale(LOCALE)
	DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
	await frames(10)
	await run()
	quit(0)

func run() -> void:
	pass

var rects := {}
var hide_entity_gizmo := false

## Record a node's rect (in saved-image pixels, relative to a crop origin) for later annotation.
func note(shot_name: String, label: String, n: Control, crop := Rect2()) -> void:
	var img_size := Vector2(3024, 1898)
	var scale := img_size / root.get_viewport().get_visible_rect().size
	var r := n.get_global_rect()
	r.position -= crop.position
	if not rects.has(shot_name):
		rects[shot_name] = {}
	rects[shot_name][label] = [r.position.x * scale.x, r.position.y * scale.y, r.size.x * scale.x, r.size.y * scale.y]

func pc_labels() -> void:
	# The hints read Cmd/Option on a Mac; show the Ctrl/Alt most readers will see, in any language.
	var cmd := "]" + tr("KEYBOARD_CONTROLS_NAME_COMMAND").capitalize() + "["
	var opt := "]" + tr("KEYBOARD_CONTROLS_NAME_OPTION").capitalize() + "["
	var ctrl := "]" + tr("KEYBOARD_CONTROLS_NAME_CONTROL").capitalize() + "["
	var alt := "]" + tr("KEYBOARD_CONTROLS_NAME_ALT").capitalize() + "["
	for l in editor.find_children("*", "RichTextLabel", true, false) + editor.get_tree().root.find_children("*", "RichTextLabel", true, false):
		if cmd in l.text or opt in l.text:
			l.text = l.text.replace(cmd, ctrl).replace(opt, alt)

func snap(name: String, crop := Rect2()) -> void:
	editor.crosshair.visible = false
	var console = editor.find_child("DebugConsole", true, false)
	if console:
		console.text = "OEUF MAP EGGITOR\n" + tr("MAPEDITOR_TUTORIAL_TIP2")
	editor.update_UI()
	var attribution = editor.find_child("entity_attribution", true, false)
	if attribution:
		attribution.visible = false
	if hide_entity_gizmo:
		editor.entity_gizmo_handles.do_disable()
	pc_labels()
	await frames(3)
	if attribution:
		attribution.visible = false
	if hide_entity_gizmo:
		editor.entity_gizmo_handles.do_disable()
	editor.crosshair.visible = false
	pc_labels()
	await shot(name, crop)

func stage_floor(base: Vector3i, tex := GRASS, size := 20) -> void:
	fill(base, base + Vector3i(size, 0, size), tex)


## Put the editor into a quiet, deterministic state for screenshots.
func prepare() -> void:
	if editor.pause_menu.visible:
		editor.pause_menu.close_menu()
		await frames(20)
	editor.pause_menu.hide()
	editor.set_physics_process(false)
	Input.mouse_mode = Input.MOUSE_MODE_CAPTURED
	editor.crosshair.modulate.a = 0.0
	TranslationServer.set_locale(LOCALE)
	editor.locale_changed()
	for l in editor.find_children("ToolbarShortcut", "Label", true, false):
		l.text = l.text.replace("⌘", "^")
	editor.locale_changed()
	var console = editor.get_node_or_null("%DebugConsole")
	if console:
		console.text = "OEUF MAP EGGITOR\n" + tr("MAPEDITOR_TUTORIAL_TIP2")

func load_map(name: String) -> void:
	await editor.loadlevel(name)
	while editor.voxel_world.loading:
		await process_frame
	await frames(20)
	await prepare()

func fill(a: Vector3i, b: Vector3i, tex: Vector2i, block := -1, rot := 0, layer := 0) -> void:
	editor.command_executor.execute({"type": commands.ADD_RANGE, "a": a, "b": b,
		"tx": tex.x, "ty": tex.y, "blocktype": shapes.CUBE if block < 0 else block,
		"rot": rot, "vflip": false, "layer": layer})

## Place the camera at eye, looking at target.
func look(eye: Vector3, target: Vector3) -> void:
	var dir := (target - eye).normalized()
	editor.camera_base.rotation = Vector3(0, atan2(-dir.x, -dir.z), 0)
	editor.camera_rot.rotation = Vector3(asin(clampf(dir.y, -0.999, 0.999)), 0, 0)
	editor.global_position += eye - editor.camera.global_position

## Rotate the camera (from its current position) so the centre ray hits target, and fire the ray.
func aim(target: Vector3) -> void:
	look(editor.camera.global_position, target)
	await in_physics(func(): editor.raycast_to_cameraforward())

## One tool frame, aimed along the camera's centre ray, inside a physics step.
func tick(left := false, left_down := false, right := false, right_down := false, left_up := false, right_up := false) -> void:
	await in_physics(func():
		editor.raycast_to_cameraforward()
		match editor.editor_mode:
			0: editor.tick_voxel_tools(left, left_down, right, right_down, left_up, right_up)
			1: editor.tick_entity_tools(left, left_down, right, right_down, left_up, right_up)
			2: editor.tick_layer_tools(left, left_down, right, right_down, left_up, right_up)
	)

## Aim at target and run one tool frame there.
func at(target: Vector3, left := false, left_down := false, right := false, right_down := false, left_up := false, right_up := false) -> void:
	look(editor.camera.global_position, target)
	await tick(left, left_down, right, right_down, left_up, right_up)

func key(code: Key, pressed: bool) -> void:
	var event := InputEventKey.new()
	event.keycode = code
	event.physical_keycode = code
	event.pressed = pressed
	Input.parse_input_event(event)
	editor._input(event)

func tool(t: int) -> void:
	editor.set_editor_mode(0)
	editor.set_tool_selected(t)
	editor.update_UI()

## Save the whole frame, or a crop of it given in canvas (UI) coordinates.
func shot(name: String, crop := Rect2()) -> Image:
	await frames(4)
	await RenderingServer.frame_post_draw
	var img: Image = root.get_viewport().get_texture().get_image()
	if crop.size != Vector2.ZERO:
		var scale := Vector2(img.get_size()) / root.get_viewport().get_visible_rect().size
		var r := Rect2i(Vector2i((crop.position * scale).round()), Vector2i((crop.size * scale).round()))
		r = r.intersection(Rect2i(Vector2i.ZERO, img.get_size()))
		img = img.get_region(r)
	img.save_png(OUT + name + ".png")
	print("saved ", name, " ", img.get_size())
	return img

## Crop a control (plus margin, in canvas units).
func shot_node(name: String, node: Control, margin := 0.0) -> Image:
	return await shot(name, node.get_global_rect().grow(margin))

func node(n: String) -> Node:
	return editor.find_child(n, true, false)
