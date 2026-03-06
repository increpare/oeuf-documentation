# [OEUF](https://store.steampowered.com/app/3831080/Oeuf/) MAP-EGGITOR TUTORIAL

> **If you prefer a video tutorial, click here : [https://youtu.be/brkR8vVeSMg](https://youtu.be/brkR8vVeSMg)**

## 0. Adding Player-Made Maps

There are two ways to add maps by other people - if you already have the file you can add it manually, or you can download them from Steam Workshop.

### 0.1 Adding Maps Manually

If you have a map file, you can add it like this (doesn't work on Steam Deck!) :

<img height="300" alt="image" src="./map-editor-images/custom_maps_menu.png" />

1. Go to **Custom Maps** on the title screen.

<img height="300" alt="image" src="./map-editor-images/open_maps_folder_button.png" />

2. Click **Open Maps Folder** to open the maps folder in your file manager. You can add map files from other people here.

### 0.2 Adding Maps from Steam Workshop

1. Go to **Custom Maps** on the title screen.
2. Click **Steam Workshop**.

<img height="300" alt="image" src="./map-editor-images/workshop_download.png" />

3. On Steam Workshop, you 'subscribe' to things to download them.

<img height="300" alt="image" src="./map-editor-images/workshop_subscribed.png" />

4. Once subscribed, maps will appear in the map list and are ready to play.

<img height="300" alt="image" src="./map-editor-images/map_in_list.png" />

## 1. Enabling the Map Editor

1. Open **Settings** :

<img height="300" alt="image" src="./map-editor-images/settings_menu.png" />

2. Enable **Map-Editor**.
3. Load into a map (custom maps are easiest to work with - the main game map has hard-coded stuff).
4. Press **Tab** to open the map editor.

<img height="300" alt="image" src="./map-editor-images/map_editor_opened.png" />


---

## 2. Basic Workflow in the Map Editor

### 2.1 Map-Editor Modes

- **Tab**
  - In-game : Open the Map Editor.
  - In the Map Editor : Toggle mouse control between camera-look and cursor-pointing.
- **Space** : Exit edit mode and spawn at the point you're aiming at.
- **Backtick** (**`**, likely the key to the left of **1**) : cycle between :
  - **Block Mode** : Edit terrain.
  - **Entity Mode** : Checkpoints, props, trigger boxes.
  - **Layer Mode** : Move large sections of terrain.

### 2.2 General Shortcuts

- **Ctrl+S** : Save
- **F5** : Reload
- **Ctrl+Z** : Undo
- **Ctrl+Y** : Redo
- **Ctrl+R** : Randomly rotate all *cube-shaped blocks* with the currently selected texture in the currently selected layer.

<img width="322" height="142" alt="image" src="./map-editor-images/editor_ui_top_left.png" />

To the top left of the screen you can see :

- The current map name (edit it and press **Enter** to save as a new file).
- The file dropdown - lists all **built-in maps** (e.g. `minimal`, `eggworld`), **Steam Workshop maps**, and **user maps** (saved in your maps folder).  Note : built-in and Steam Workshop maps are *read-only*, but you can save them under new filenames.

<img height="300" alt="image" src="./map-editor-images/file_dropdown.png" />

- The button to open the maps folder (shortcut : **Ctrl+L**).

---

## 3. Camera and Movement (in the Map Editor)

- **WASD** : Move camera
- **Shift** : Faster movement
- **Q / E** : Up / Down
- **Z / C** : Rotate Left / Right

(Don't forget : **Tab** toggles between camera-look and cursor-pointing modes.)

---

## 4. Block Tools

<!--nearest neighbour upscaling-->
### 4.1 <img src="./map-editor-images/tool_1.png" /> Basic Block-Placer

- **Click** : Place block.
- **Right-Click** : Delete block.
- **Shift+Click (hold)** : Rapid placement.
- **Shift+Right-Click (hold)** : Rapid deletion.
- **Ctrl+Click** : Place a block offset one step from the face you're targeting.
- **Alt+Click** : Sample an existing block (eyedropper).
- **Scroll Wheel** or **Shift+Number Key** : Change the selected block texture in the left toolbar.
- **Ctrl+Scroll Wheel** or **- / =** : Change texture page in the left toolbar.


#### 4.1b Block Shapes

<img height="91" alt="image" src="./map-editor-images/shape_toolbar.png" />

- The top-right toolbar includes ramps and other shapes.
- **R** : Rotate selected shape.
- **V** : Flip vertically.
- Shortcuts are as listed in the toolbar (an underscore **_** means hold **Shift** while pressing the named key).
- Do *not* use the staircase block anywhere the player might roll across it - it doesn't play well with egg physics.

### 4.2 <img src="./map-editor-images/tool_2.png" /> Plane Tool

<img height="300" alt="image" src="./map-editor-images/plane_drag_basic.png" />

- **Click+Drag** : Draw a planar sheet (floor or wall).

- **Shift while dragging** : Push the plane one block into the target surface for a flush fit :

<img height="300" alt="image" src="./map-editor-images/plane_drag_shift_flush.png" />

- **Right-Click+Drag** : Delete a planar region (useful for doors and openings).

<img height="300" alt="image" src="./map-editor-images/plane_drag_delete_region.png" />

- **Alt while dragging** : Use the initial click point as the *centre* of the plane rather than a corner.

<img height="300" alt="image" src="./map-editor-images/plane_drag_alt_centered.png" />

- When drawing a plane with the 45° slope selected, you drag the plane along the slope :

<img height="300" alt="image" src="./map-editor-images/slope_plane_drag.png" />


---

### 4.3 <img src="./map-editor-images/tool_3.png" /> Extrude Tool

- **Click+Drag** to define a 2D area, then move your mouse and **Click** to extrude to that depth.  Very useful!
- Works on irregular shapes :

<img height="300" alt="image" src="./map-editor-images/extrude_irregular_shape.png" />

- **Right-Click** : Nothing to do with extrude, really, more a "delete everything inside this box" tool.

### 4.4 <img src="./map-editor-images/tool_4.png" /> Box Tool

<img height="300"  alt="image" src="./map-editor-images/box_tool_hollow_box.png" />

- **Click+Drag** : Create a hollow box.
- **Shift while dragging** : Remove end caps (for tunnels or open boxes).
- **Right-Click** : Carve out a room.

<img height="300"  alt="image" src="./map-editor-images/box_tool_no_end_caps.png" />

### 4.5 <img src="./map-editor-images/tool_5.png" /> Paint Tool

- **Click** : Apply texture to highlighted block.
- **Right-Click** or **Alt+Click** : Sample block texture and shape.
- **Shift+Scroll Wheel** : Adjust brush radius.
- **Shift+Click** : Replace all blocks of the pointed-at texture in the current layer with the selected texture (undoable - but be careful).

---

### 4.6 <img src="./map-editor-images/tool_6.png" /> Hill-Dropper Tool

- **Click** : Drop blocks from above to form organic hills.
- **Right-Click** : Subtract hill-shape from terrain.
- **Scroll Wheel** : Hill height.
- **Shift+Scroll Wheel** : Hill width.
- Useful for mountains and natural terrain; can be used to create 'geological'-looking layers.

<img height="300" alt="image" src="./map-editor-images/hill_dropper_example.png" />

---

### 4.7 <img src="./map-editor-images/tool_7.png" /> Sculpt Tool

<img height="300" alt="image" src="./map-editor-images/sculpt_tool_example.png" />

Grow/shrink your terrain within a sphere.

- **Scroll Wheel** : Control intensity.
  - **Low** : Shrink/erase terrain inside the sphere.
  - **High** : Grow/extrude terrain inside the sphere.
  - **Mid** : Tends to square off shapes.
- **Shift+Scroll Wheel** : Adjust brush radius.

---

### 4.8 <img src="./map-editor-images/tool_8.png" /> Sphere Tool

<img height="300" alt="image" src="./map-editor-images/sphere_tool_example.png" />

Adds or removes a sphere.

- **Scroll Wheel** : Choose texture.
- **Shift+Scroll Wheel** : Change sphere size.
- **Click** : Add a sphere.
- **Shift+Click** : Centre sphere on cursor point.
- **Right-Click** : Subtract a sphere (good for caves).

---

### 4.9 <img src="./map-editor-images/tool_9.png" /> Grout Tool

<img height="300" alt="image" src="./map-editor-images/grout_tool_smoothing.png" />

- **Click** : Smooth terrain by filling in edge voxels using intermediate block shapes.
- **Ctrl+Click** : Smooth using the currently selected toolbar texture.
- **Right-Click** : Remove non-cube blocks.
- **Shift+Scroll Wheel** : Change brush size.

<img height="300" alt="image" src="./map-editor-images/grout_tool_cleanup.png" />

---

### 4.10 <img src="./map-editor-images/tool_0.png" /> Planar Drawing Tool

- **Click+Drag** : Draw on the current horizontal plane.
- **Right-Click** : Remove blocks.
- **Shift+Scroll Wheel** : Raise or lower the drawing plane.

<img height="300" alt="image" src="./map-editor-images/planar_draw_example.png" />

---

## 5. Entity Mode

Enter Entity Mode by pressing **Backtick** (**`**) until the Entity Mode UI appears.

<img height="300" alt="image" src="./map-editor-images/entity_mode.png" />

In Entity Mode there are two tools - the **Object Tool** and the **Trigger-Box Tool**.  Objects are things placed at a single point in the world that you can see, like checkpoints and torches.  Trigger boxes are larger invisible areas that trigger an effect when the player enters them, such as playing a music track or displaying a message.

### 5.1 <img src="./map-editor-images/entity_tool_object.png" /> Object Tool

- **Click** : Place or select an object.
- **Right-Click** : Delete an object.

#### 5.1.1 <img src="./map-editor-images/object_1_Bonfire_Start.png" /> Start Checkpoint

- Every map *must* include a **Start Checkpoint**.
- This is where the player spawns in custom maps; it looks just like a normal checkpoint.
- The `area_name` tag controls the text shown when the player starts a new game on your map.  The default value is `"CUSTOM_LEVEL_LETS_GO"`, a localisation tag that amounts to "Let's go!" in English, but you can change it to whatever message you like.
- (The `Nest.tscn` asset can also function as a start checkpoint, but its behaviour is heavily hard-coded - I don't recommend using it in your own maps unless you're modding the main game, and even then, test carefully and avoid modifying the geometry around the starting area.)

<img height="300" alt="image" src="./map-editor-images/start_checkpoint.png" />

#### 5.1.2 <img src="./map-editor-images/object_2_Bonfire.png" /> Normal Checkpoint

- Totally normal checkpoint.
- Set the `area_name` tag to control the text shown when the player activates it.
- You will often want to put checkpoints inside **Music** trigger boxes so that if a player resumes a saved game, the correct music will play.

#### 5.1.3 <img src="./map-editor-images/object_3_Bonfire_End.png" /> End Checkpoint

- Custom maps don't have a dedicated final checkpoint (unless using the nest).  This behaves like a normal checkpoint.
- The default `area_name` tag value is `"CUSTOM_LEVEL_YOU_MADE_IT"`, which localises to "You made it!" in English - but you can put whatever you like in there.

#### 5.1.4 <img src="./map-editor-images/object_4_Torch.png" /> Torch

<img height="300" alt="image" src="./map-editor-images/object_torch_example.png" />

Provides a point of light.  Handy when things are getting a bit dark - but don't overdo it, as each torch adds a light source and the performance cost can add up.

#### 5.1.5 <img src="./map-editor-images/object_5_Star.png" /> Star

<img height="300" alt="image" src="./map-editor-images/star_shot.png" />

<img height="300" alt="image" src="./map-editor-images/star_collect.png" />

- Makes a satisfying sound when collected, and displays a running count of stars collected vs. the total number of starts on the map.
- Entirely optional and inconsequential. (I added these thinking I might use them in the main game, but decided against it in the end.)

#### 5.1.6 <img src="./map-editor-images/object_6_Chair.png" /> Chair

<img height="300" alt="image" src="./map-editor-images/object_chair_example.png" />

Purely decorative geometry.  Not used in the main game.

#### 5.1.7 <img src="./map-editor-images/object_7_Table.png" /> Table

<img height="300" alt="image" src="./map-editor-images/object_table_example.png" />

Purely decorative geometry.  Not used in the main game.

#### 5.1.8 Other Objects

There are other objects accessible via the `asset_name` dropdown in the properties panel, but they have unusual or hard-coded behaviour tied to the main game, so I don't recommend using them in custom maps. (The `Nest.tscn` object, for instance, has a great deal of specific hard-coded logic and spawns invisible collision geometry during cutscenes.) It's fine to leave them in place if you're modding the main game map, just be careful to not modify these objects or their surrounding geometry.

### 5.2 <img src="./map-editor-images/entity_tool_trigger.png" /> Trigger-Box Tool

- Trigger boxes are big invisible areas that do something when the player enters them.

<img height="300" alt="image" src="./map-editor-images/triggerbox.png" />

- In the properties panel you can edit various properties, including position and dimensions (WUN = West/Up/North, EDS = East/Down/South) :

<img height="300" alt="image" src="./map-editor-images/trigger_intro.png" />

- You can also **move** and **resize** trigger boxes in the viewport using the **move gizmo** and **face resize handles** (drag the coloured handles on each face of the box).

<img height="300" alt="image" src="./map-editor-images/resize_trigger.gif" />

- Note that each trigger box has a 1×1×1 'core' that you click to select it. (Technically this core doesn't need to be inside the trigger area, but...why would you do that?)

#### 5.2.1 <img src="./map-editor-images/trigger_1_music.png" /> music

- Starts playing a music track when the player enters.
- Usually you want to have a music trigger at each checkpoint so that the correct music plays when a player resumes a saved game.
- Choose the track from the dropdown in the properties panel.
<img height="300" alt="image" src="./map-editor-images/music_property_panel.png" />
- Any time in the map editor you click on a music trigger you'll hear a preview of its music.
- You can't add your own music files, but in addition to the main OST there are several hours of bonus tracks included for use in custom maps.
- The OST is [here](https://store.steampowered.com/app/4217410/Oeuvre_Oeuf_Soundtrack/) if you want to listen to it outside the game.


#### 5.2.2 <img src="./map-editor-images/trigger_2_arealabel.png" /> arealabel

<img height="300" alt="image" src="./map-editor-images/arealabel_props.png" />

Arealabel trigger boxes display a message on screen when the player enters, independently of checkpoints.  If the `area_name` matches a built-in location name (case-sensitive), the game localises it - e.g. entering `FOREST` displays "Forest of Branching Paths" in English.  Otherwise it just displays your text verbatim, so entering `Hello, world!` displays "Hello, World!".

<img height="300" alt="image" src="./map-editor-images/arealabel2.png" />

#### 5.2.3 <img src="./map-editor-images/trigger_3_killbox.png" /> KILLBOX

<img height="300" alt="image" src="./map-editor-images/killbox.png" />

- If you enter a killbox, you are internally marked as *doomed*, and will oof the next time you touch horizontal-ish map geometry (ramps included).
- Drawn in red in the map view for easy identification.
- While *doomed*, you cannot trigger checkpoints until you restart.

#### 5.2.4 <img src="./map-editor-images/trigger_4_torch.png" /> TORCH

While inside this trigger box, the player emits light.  Handy for subtly brightening dark areas without placing lots of torch props (which can be expensive to render and visually distracting).

<img height="300" alt="image" src="./map-editor-images/torchbox.png" />

#### 5.2.5 <img src="./map-editor-images/trigger_5_advanced.png" /> Generic Trigger-Boxes

There are a few other really finicky trigger-box types - what they do is specified by their meta tags.  I don't think they're appropriate for general use, so I won't document them.  If you're modding the main game map it's fine to leave them in place - but pls don't use them in new custom maps, as they may behave unexpectedly.

---

## 6. Layer Mode

Cycle to Layer Mode with **Backtick** (**`**).

- It can be useful to divide large maps into layers
- Empty layers are shown with a red tint in the layer list so you can spot them easily.

### 6.1 Layer Visibility

- **Shift+Click** a layer to hide all other layers; **Shift+Click** again to restore them.

<img height="300" alt="image" src="./map-editor-images/layer_visibility_example.png" />

---

### 6.2 Layer Tools

#### 6.2.1 <img src="./map-editor-images/layer_transform_tool_icon.png" /> Layer Transform Tool

<img height="300" alt="image" src="./map-editor-images/layer_transform_example.png" />

- **Click** : Select a layer.
- You can then **move**, **rotate**, or **mirror/flip** the entire layer using the gizmo.
- Note : only one block can occupy a given position - if you drag one layer to overlap another, blocks are going to get deleted from one of the layers!

---

#### 6.2.2 <img src="./map-editor-images/layer_assignment_tool_icon.png" /> Layer Assignment Tool

- **Click** and drag out a box : All visible blocks and entities inside get assigned to the currently selected layer.
- **Alt+Click** : Select the highlighted layer.
- Useful for correcting blocks assigned to the wrong layer.

<img height="300" alt="image" src="./map-editor-images/layer_assignment_example.png" />

---

### 6.3 <img src="./map-editor-images/layer_clipboard.png" /> Clipboard

- **Click** on a layer to copy it to the clipboard.
- **Right-Click** : Paste the clipboard contents in the indicated position (shown as a purple box).
- **Ctrl+C** : Copy the currently selected layer to the clipboard.
- You can copy and paste between different map files!

<img height="300" src="./map-editor-images/layer_copy_paste_example.png" />

---

## 7. Layer List

<img height="300" src="./map-editor-images/layer_list_view.png" />

To the right-hand side of the screen you have the layer list, with the following buttons :

### 7.1 <img src="./map-editor-images/layer_item_up_down.png" /> Move Layer Up / Down

Rearranges layers.

### 7.2 <img src="./map-editor-images/layer_item_visible.png" /> Visibility

Toggles the visibility of the layer (visible : <img class="img-inline" src="./map-editor-images/layer_item_visible_black.png" />, hidden : <img class="img-inline" src="./map-editor-images/layer_item_invisible_black.png" />).

### 7.3 <img src="./map-editor-images/layer_item_delete.png" /> Delete

Deletes the layer.

### 7.4 <img src="./map-editor-images/layer_item_merge_up.png" /> Merge Up

Merges the layer into the layer above it.

### 7.5 <img src="./map-editor-images/layer_item_new.png" /> New Layer

Creates a new empty layer.

---

## 8. <img src="./map-editor-images/upload_icon.png" /> Upload to Steam Workshop

Uploading to Steam Workshop is a pretty easy affair - when you're happy with your map, just click the steam button in the toolbar :

<img height="300" src="./map-editor-images/workshop_upload.png" />

After a moment, you'll see a confirmation message and the Steam Workshop page for your map will open automatically.

<img height="300" src="./map-editor-images/workshop_success.png" />

The thumbnail is generated from a screenshot of the current view when you save.

<img height="300" src="./map-editor-images/workshop_page_appearance.png" />

If you'd like to customise the listing further, you can do so from that page.  The mod is associated with the file name of the map - if you resave the file it will update your map on the Steam Workshop.

---

## 9. Feedback and Bug Reports

Does this make sense? I hope so! Feedback and bug reports are always welcome - e-mail me at [analytic@gmail.com](mailto:analytic@gmail.com).
