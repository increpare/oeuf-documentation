## Title-screen, custom-map and multiplayer menu screenshots. Appended to capture_lib.gd by capture.sh.

func run() -> void:
	pass

func neutral_names() -> void:
	for n in root.find_children("*", "Control", true, false):
		if ("text" in n) and typeof(n.text) == TYPE_STRING and "increpare_servertest" in n.text:
			n.text = n.text.replace("increpare_servertest", "eggbert")
		if ("text" in n) and typeof(n.text) == TYPE_STRING and "Oeuf Country mp server" in n.text:
			n.text = n.text.replace("Oeuf Country mp server", "Egg Hunt")

func menus_only() -> void:
	var ts = editor.title_screen
	editor.pause_menu.hide()
	await frames(20)
	ts.mouse_hover(2)
	ts.do_highlight(2)
	await frames(20)
	await shot("m_title")
	ts.switch_to_menu(ts.get_node("%SettingsMenu"))
	await frames(40)
	await shot("m_settings")
	ts.switch_back_to_title_from(ts.get_node("%SettingsMenu"))
	await frames(30)
	var ls = ts.get_node("%LevelSelectMenu")
	ts.switch_to_menu(ls)
	await frames(60)
	await shot("m_levels")
	for tab in ["local", "workshop"]:
		ls.tab_selection_idx[ls.current_tab] = ls.selection_idx
		ls.current_tab = tab
		ls._apply_current_tab_list()
		ls.selection_idx = ls._first_command_selection_idx()
		ls.update_ui()
		await frames(30)
		await shot("m_levels_" + tab)
	ts.switch_back_to_title_from(ls)
	await frames(30)
	ts.open_multiplayer_menu()
	await frames(60)
	var mm = editor.multiplayer_menu
	mm.menu_layout._select_action(true)
	await frames(30)
	neutral_names()
	await frames(4)
	await shot("m_host")
