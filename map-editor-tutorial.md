# [OEUF](https://store.steampowered.com/app/3831080/Oeuf/) MAP EGGITOR TUTORIAL

If you prefer a video version of the tutorial, here's one : https://youtu.be/BCKunr3oAbc

## Contents
* [0. Adding Player-Made Maps](#0-adding-player-made-maps)
* [1. Enabling the Editor](#1-enabling-the-editor)
* [2. Basic Workflow in Editor](#2-basic-workflow-in-editor)
* [3. Camera and Movement (Editor Mode)](#3-camera-and-movement-editor-mode)
* [4. Voxel Tools](#4-voxel-tools-)
* [5. Object Mode (Entities and Trigger-Boxes)](#5-object-mode--entities-and-trigger-boxes)
  * [5.1 Entity Tool](#51-entity-tool-img-height40-srcmap-editor-imagesd7c0fbfe-3b7f-4003-b53a-f00957440e98png-)
  * [5.2 Trigger-Box Tool](#52-trigger-box-tool-img-height40-altimage-srcmap-editor-imagestrigger_box_toolpng-)
* [6. Layer Mode (Large‑Scale Editing)](#6-layer-mode--large‑scale-editing)
  * [6.1 Layer Visibility](#61-layer-visibility)
  * [6.2 Layer Tools](#62-layer-tools)
* [7. Upload to Steam Workshop](#7-upload-to-steam-workshop)
* [8. Feedback and bug reports](#8-feedback-and-bug-reports)

## 0. Adding Player-Made Maps

There are two ways to add maps by other people - if you already have the file, you can add it manually, or if you want to download it from steam workshop, you can do that too.

### 0.1 Adding Maps Manually

If you have a map file, you can add it like this : (doesn't work on Steam Deck!)

<img  height="300" alt="image" src="./map-editor-images/4e172e6a-8c85-4a5c-8d44-3d7c6dda61c5.png" />

1. Go to **Custom Maps** on the title screen

<img height="300" alt="image" src="./map-editor-images/3755ee22-6eb6-4406-aa1f-e3f7b4867b35.png" />

2. Go to **Open Maps Folder** to open the maps folder in your file manager. You can add map files that you have gotten from other people here.

### 0.2 Adding Maps from Steam Workshop

1. Go to **Custom Maps** on the title screen

2. Click on **Steam Workshop**

<img height="300" alt="image" src="./map-editor-images/workshop_download.png" />

3. On Steam Workshop, you 'subscribe' to things to download them.  

<img height="300" alt="image" src="./map-editor-images/workshop_subscribed.png" />

4. Once you've done that, they should just be visible in the map list to play.

<img height="300" alt="image" src="./map-editor-images/map_in_list.png" />

## 1. Enabling the Editor
1. Open **Settings** :

<img height="300" alt="image" src="./map-editor-images/8774fe92-ef1f-4e8b-b678-ce9e627328e5.png" />

2. Enable **Map Editor**.
3. Load into a level (custom levels are easiest to work with - the main game level has hard-coded stuff).
4. Press **Tab** to open the editor.

<img height="300" alt="image" src="./map-editor-images/a63f9a9f-f53c-4f11-ac1b-b5afa84399a2.png" />


---

## 2. Basic Workflow in Editor

### Editor Modes :

- **Tab** :
  - If you're in-game, it opens the map editor!
  - In editor mode, it toggles mouse control between camera-look and cursor-pointing.
- **Space** : Exits edit mode and spawns you where you're pointing at.
- **Backtick** (**`**, or whatever key is to the left of the '1' on your keyboard) to cycle between :
  - **Voxel Mode** (editing terrain)
  - **Object Mode** (checkpoints, props, trigger-boxes)
  - **Layer Mode** (moving large sections of terrain)

### General commands :

- **Ctrl + S** save
- **F5** reload
- **Ctrl + Z** undo
- **Ctrl + Y** redo
- **Ctrl + R** : randomly rotates all cubes with the currently-selected tile-graphic in the currently-selected layer.

<img width="322" height="142" alt="image" src="./map-editor-images/898dc489-160f-45db-b982-bb0d8608db64.png" />

In the top left of the screen you can see :

* the current file name (change and press enter to save as a new file)
  * (note : some built‑in maps are read‑only (e.g., `minimal`, `eggworld`). You can save them under other files names OK though!)
* the dropdown menu shows all built-in maps files, and those you have saved in your level folder.
* the button to open up the levels folder (shortcut : **Ctrl + L**).

---

## 3. Camera and Movement (Editor Mode)
- **WASD** : Move camera
- **Shift** : Faster movement
- **Q / E** : Up / Down
- **Z / C** : Rotate Left / Right
- (don't forget : **TAB** toggles camera/cursor mouse-modes)

---

## 4. Voxel Tools :

<!--nearest neighbour upscaling-->
### 4.1 Basic Voxel Placer <img height="30" src="./map-editor-images/tool_1.png" style="image-rendering : pixelated;" />
- **Left click** : Place block.
- **Right click** : Delete block.
- **Shift + left click (hold)** : Rapid placement.
- **Shift + right click (hold)** : Rapid deletion.
- **Ctrl + left click** : Place a block one tile removed from the face you're targeting.
- **Alt + click** : Sample an existing block (eyedropper).
- **Scroll-Wheel** or **Shift+number keys** : Change current tile.
- **Ctrl + scroll-wheel** or **- / +** : Change tile page.


### 4.1b (Aside : Voxel Shapes and Rotation) 

<img height="91" alt="image" src="./map-editor-images/shape_toolbar.png" />


- The top-right toolbar includes ramps and other shapes.
- **R** : Rotate selected shape.
- **V** : Flip vertically.
- The shortcuts are as listed above - note that an underscore **_** means to hold **Shift** while pressing the named key.
- If you're drawing a plane and have the 45° slope selected, you drag the plane along the slope :

<img height="300" alt="image" src="./map-editor-images/e16c5379-3e0a-472b-8729-d67dfd6a6890.png" />

- Do *not* use the staircase block anywhere where the player might roll across it - it does not play well with egg physics.

### 4.2 Plane-Drag / Wall Tool <img height="30" src="./map-editor-images/tool_2.png" style="image-rendering : pixelated;" />

<img height="300" alt="image" src="./map-editor-images/66861a5d-948f-419e-826b-0709e8901460.png" />

- **Left click + drag** to draw a planar sheet (floor or wall).

- **Shift while dragging** : Push the plane one voxel into the target surface for a flush surface :

<img height="300" alt="image" src="./map-editor-images/fed6c022-ccac-4f50-a183-e54a1910b819.png" />

- **Right click + drag** : Delete a planar region (good for making doors/openings)

<img height="300" alt="image" src="./map-editor-images/3e38286a-fc16-4f8e-8b2c-f0b84892fb11.png" />

- Holding **Alt** while doing the above causes the initial point you click to be the *centre* of the plane rather than the corner.

<img height="300" alt="image" src="./map-editor-images/082ad691-7389-431c-8dcd-d478a5997fc8.png" />

---

### 4.3 Extrude Tool <img height="30" src="./map-editor-images/tool_3.png" style="image-rendering : pixelated;" />
- **Select an area**, then **drag** to extrude it outward.
- Works on irregular shapes :

<img height="300" alt="image" src="./map-editor-images/e489ee33-5702-471a-b6dc-6cfb11471ad1.png" />

- **Right‑click variant** deletes large cuboids for cleanup. Nothing to do with extrude, really, more a "delete everything in this volume" tool.

### 4.4 Room / Box Tool <img height="30" src="./map-editor-images/tool_4.png" style="image-rendering : pixelated;" />

<img height="300"  alt="image" src="./map-editor-images/a6d88753-b396-4f04-9792-af3de74201fa.png" />

- **Click + drag** to create a hollow rectangular volume.
- **Shift while using** : Removes end caps (for tunnels / open boxes).

<img height="300"  alt="image" src="./map-editor-images/52efd428-d08a-4328-96e2-df69cec3cf48.png" />

### 4.5 Paint Tool <img height="30" src="./map-editor-images/tool_5.png" style="image-rendering : pixelated;" />

Paints existing voxels.

- **Alt + click** : Sample tile (including shape).
- **Click** : Repaint.
- **Shift + scroll-wheel** : Adjust brush radius.
- **Shift + click** : Replace all tiles of the pointed-at graphic in the current layer with the selected tile (undoable, but be careful).

---

### 4.6 Landscape / Hill-Dropper Tool <img height="30" src="./map-editor-images/tool_6.png" style="image-rendering : pixelated;" />
- Drops blocks from above to form organic hills.
- **Scroll-Wheel** : Hill height.
- **Shift + scroll-wheel** : Hill width.
- Useful for mountains and natural terrain; can be used to create 'geological'-looking layers.

<img height="300" alt="image" src="./map-editor-images/9676771a-aec1-4354-8203-8a037999b901.png" />

---

### 4.7 Grow / Shrink Tool <img height="30" src="./map-editor-images/tool_7.png" style="image-rendering : pixelated;" />

<img height="300" alt="image" src="./map-editor-images/c7b78285-8fef-4007-a6e1-31a1805f57e6.png" />

Spherical modifier with an intensity meter (controlled with **Scroll-Wheel**) :

  - Low setting : shrink/erase inside the sphere.
  - High setting : grow/extrude outward.
  - Mid setting : tends to square off shapes.
- **Shift + scroll-wheel** : Adjust brush radius.

---

### 4.8 Add / Subtract Sphere Tool <img height="30" src="./map-editor-images/tool_8.png" style="image-rendering : pixelated;" />

<img height="300" alt="image" src="./map-editor-images/6a28e39e-08d3-498d-8d25-9103ed603eb3.png" />

Adds/removes a sphere!

- **Scroll-Wheel** : Choose tile.
- **Shift + scroll-wheel** : Change sphere size.
- **Left click** : Add a sphere.
- **Shift + left click** : Centre sphere on cursor point.
- **Right click** : Subtract a sphere (good for caves).

---

### 4.9 Smooth / Grout Tool <img height="30" src="./map-editor-images/tool_9.png" style="image-rendering : pixelated;" />

<img height="300" alt="image" src="./map-editor-images/f3b4592d-4d5c-4eed-a9ba-f157b5dc7dcc.png" />

- **Click** : Smooth terrain by inserting appropriate edge pieces (using one of the neighbouring textures).
- **Shift + scroll-wheel** : Change brush size.
- **Shift + click** : Grout mode; fills seams using the current tile instead of smoothing.

<img height="300" alt="image" src="./map-editor-images/e15cd4e3-473d-4f49-ad7f-a26ea4e44354.png" />

---

### 4.10 Planar-Draw Tool <img height="30" src="./map-editor-images/tool_0.png" style="image-rendering : pixelated;" />
- **Click** and drag to draw on the current plane.
- **Shift + scroll-wheel** raises and lowers the drawing plane.

<img height="300" alt="image" src="./map-editor-images/5a7a12fe-4344-4d9e-aaeb-ea6050e37ab9.png" />

---

## 5. Object Mode : Entities and Trigger-Boxes
Enter Object Mode by pressing **backtick** (if you have a different keyboard layout, it should still be whatever button is to the left of the 1 key on the top-left of your keyboard) until the Object UI appears.

<img height="300" alt="image" src="./map-editor-images/object_mode.png" />

In Object Mode there are two tools - *entity* placement and *trigger-box* placement.  Entities are things that are placed in the world that you can see and generally just occupy a single tile, like checkpoints and torches.  Trigger-boxes are larger areas, invisible to the player, where something happens if you enter them, like playing a music track, or displaying a message. 

### 5.1 Entity Tool <img height="40" src="./map-editor-images/d7c0fbfe-3b7f-4003-b53a-f00957440e98.png" />

This mode has two brushes, one for placing entities, another for placing trigger-boxes.  

- **Left Click** to place/select
- **Right Click** to delete
   
####  5.1.1 Start-Checkpoint <img height="40"  alt="image" src="./map-editor-images/entity_1.png" />
- Every level must include a start checkpoint.
- This is where the player spawns in custom levels, but looks just like a normal checkpoint.
- The area_name tag is what text gets shown when you spawn into the level. By default the value is "CUSTOM_LEVEL_LETS_GO", which is a specific localized key that is "Let's go!" in English.
- (The 'Nest.tcsn' asset can also function as a 'start' checkpoint, but its behaviour has a lot of hard-coded nonsense in it so I don't recommend using it in your own levels, unless they mod the regular game - and even then, be careful to test it and not modify the geometry around the starting area too much)

<img height="300" alt="image" src="./map-editor-images/start_checkpoint.png" />

#### 5.1.2 Normal Checkpoint <img height="40"  alt="image" src="./map-editor-images/entity_2.png" />
- Totally normal checkpoint.
- You can set the area_name tag to whatever you want to display when the player activates it.
- If you want to trigger music when you reach the point, or spawn back to it, you have to use a music trigger-box for that.

#### 5.1.3 End-Checkpoint <img height="40"  alt="image" src="./map-editor-images/entity_3.png" />
- Unlike the main game, custom levels don't really have a proper final checkpoint (unless they use the nest).  This is just a normal checkpoint really.
- By default the area_name tag is "CUSTOM_LEVEL_YOU_MADE_IT", which is localized to "You made it!" in English. But you can put whatever you want in there.

#### 5.1.4 Torches <img height="40" alt="image" src="./map-editor-images/entity_4.png" />

<img height="300" alt="image" src="./map-editor-images/1749efe9-b7dc-41ca-98a8-9eede13e832a.png" />

- What it looks like.  Nice if things are getting a bit dark innit.
- But don't overdo it, each torch has a light and the cost might add up.

#### 5.1.5 Star <img height="40" alt="image" src="./map-editor-images/entity_5.png" />

<img height="300"  alt="image" src="./map-editor-images/star_shot.png" />

<img height="300"  alt="image" src="./map-editor-images/star_collect.png" />

- Makes a nice sound when you collect them and shows you how many you've collected vs total in the level.
- Totally optional and of no consequence (I implemented these thinking I might want to put them in the main game, but decided better of it in the end).

#### 5.1.6 Chair <img height="40" alt="image" src="./map-editor-images/entity_6.png" />

<img height="300" alt="image" src="./map-editor-images/5406d0d6-f2d4-4662-a423-e9f7ec4e024b.png" />

Just a bit of geometry.  Not used in the main game.

#### 5.1.7 Table  <img height="40" alt="image" src="./map-editor-images/entity_7.png" />

<img height="300" alt="image" src="./map-editor-images/d8c8803e-58f4-4fd3-8d04-11374e784714.png" />

Just a bit of geometry.  Not used in the main game.

#### 5.1.8 Other entities

There are other objects in the game, accessible via the asset_name dropdown in the object info panel, but they contain weird/hacky behaviour specific to the main game, so I don't recommend using them.  Stuff like the Nest.tscn object that just has a lot of hard-coded and very particular behaviour that I don't want to explain.  However, modifying the main game map should be safe enough, even though it contains these objects - just be careful of modifying these objects or their surroundings in-game if you come across them!

### 5.2 Trigger-Box Tool <img height="40" alt="image" src="./map-editor-images/trigger_box_tool.png" />

- Trigger-boxes are big invisible areas that do something when the player enters them.

<img height="300" alt="image" src="./map-editor-images/triggerbox.png" />

- In the sidebar you can edit various properties, including their position and dimensions (WUN=West/Up/North, EDS=East/Down/South):

<img height="300" alt="image" src="./map-editor-images/trigger_intro.png" />

- You can also **move** and **resize** trigger-boxes in the viewport using the **move gizmo** and **face resize handles** (drag the coloured handles on each face of the box).

<img height="300" alt="image" src="./map-editor-images/resize_trigger.gif" />

#### 5.2.1 music <img height="40" alt="image" src="./map-editor-images/trigger_icon_1.png" />
- This causes music to play if you enter it.  
- Usually you want to have a music trigger at each checkpoint, so that if a player resumes a save game, there'll automatically be the right music playing.
- You can choose the music track from a dropdown list in the properties panel.

<img height="300" alt="image" src="./map-editor-images/music_property_panel.png" />

- Any time in the editor you click on a music trigger you'll hear a preview of its music.
- You can't include your own music files. However in addition to the core OST of the game, there are several hours of bonus tracks included for people who want to make their own levels to use.
- The Music OST is [here](https://store.steampowered.com/app/4217410/Oeuvre_Oeuf_Soundtrack/) if you want to listen to it casually.

#### 5.2.2 arealabel <img height="40" alt="image" src="./map-editor-images/trigger_icon_2.png" />
<img height="300" alt="image" src="./map-editor-images/arealabel_props.png" />

- Arealabel trigger-boxes show a message on screen when the player enters, independently of checkpoints. If the 'area name' is a built-in location name (case-sensitive), the game displays that location name (and will localise it. e.g. if you enter "FOREST" the text will be "Forest of Branching Paths"); otherwise it displays your text verbatim. So if you enter `Hello, world!` as your area name, it displays "Hello, World!".

<img height="300" alt="image" src="./map-editor-images/arealabel2.png" />

- The game remembers the last message it displayed, and it won't display the same message twice in a row.


#### 5.2.3 KILLBOX <img height="40" alt="image" src="./map-editor-images/trigger_icon_3.png" />

<img height="300" alt="image" src="./map-editor-images/killbox.png" />

- Special trigger-boxes (drawn red in the editor for easy identification) that cause the player to die on contact the next time you touch some horizontal-ish level geometry (Ramps should also kill).
- Useful for hazards and boundaries.

#### 5.2.4 TORCH <img height="40" alt="image" src="./map-editor-images/trigger_icon_4.png" />
- While players are inside the volume, they emit light. Handy for subtly making dark areas easier to understand without needing to place loads of torch props, which can be expensive/distracting.

<img height="300" alt="image" src="./map-editor-images/torchbox.png" />

#### 5.2.5 Generic trigger-boxes <img height="40" alt="image" src="./map-editor-images/trigger_icon_5.png" />

- There are a few other really finicky trigger-box types - what they do is specified by their meta tags. I don't think they're appropriate for general use, so I won't document them.  It's fine to leave them in the main map if you're modding it, but don't use them in new levels you're building from scratch - they might behave weirdly in ways that are not obvious from their names.

---

## 6. Layer Mode : Large‑Scale Editing

Cycle to Layer Mode with **Backtick** (**`**).

- It can be useful to divide large maps into sections/layers
- Empty layers are shown with a red tint in the layer list so you can spot them easily.

### 6.1 Layer Visibility
- **Shift + click** a layer to hide all other layers; shift‑click again to restore them.

<img height="300" alt="image" src="./map-editor-images/0e233973-4c4a-4819-9932-c77c675cf991.png" />

---

### 6.2 Layer Tools

#### 6.2.1 Layer Selection/Transformation tool <img height="40" alt="image" src="./map-editor-images/025310c3-e0be-4096-8121-f2fc38577e71.png" />

<img height="300" alt="image" src="./map-editor-images/703ba35d-dc51-46bd-afc3-f1fe9815d75c.png" />

- Use the layer selection tool to pick a layer by clicking geometry.
- You can then **move**, **rotate**, or **mirror/flip** the entire layer.
- Only one voxel can occupy a single position - if you drag one layer to overlap another, voxels are going to get deleted from one of the layers!

---

#### 6.2.2 Voxel Assignment Tool <img height="40" alt="image" src="./map-editor-images/9983cbf1-1fc2-4c29-9b3e-465b89c4f254.png" />

- Drag a volume; all voxels inside become part of the currently selected layer.
- Useful for fixing pieces assigned to the wrong layer.

<img height="300" alt="image" src="./map-editor-images/47ee56de-ddc6-4ba6-b265-2ba522d36c10.png" />

---

### 6.3 Copy/Paste Layers<img height="40" alt="image" src="./map-editor-images/07df4b1b-83fe-40dd-91ef-2ac8ce3f8170.png" />

- Copy a selected layer/group and paste it as a brush.
- Select the Copy tool (3) and click anywhere to copy the current layer to the clipboard.
- Select paste and move (not rotate) your camera - note that you can now see the outline of the layer move with your camera - click to paste a copy of the copied layer.
- You can copy/paste between different files!

<img height="300" src="./map-editor-images/b54e33d7-6058-4959-a116-73188bdf6d01.png" />

---

## 7. Upload to Steam Workshop

Uploading to Steam Workshop is a pretty easy affair - when you're happy with your level, just hit the steam button in the toolbar :

<img height="300" src="./map-editor-images/workshop_upload.png" />

Click on this, and wait for a moment, and you will see a message when the upload is complete, and it should open the Steam Workshop page as well.

<img height="300" src="./map-editor-images/workshop_success.png" />

The thumbnail is generated from the view when you hit save.  

<img height="300" src="./map-editor-images/workshop_page_appearance.png" />

If you wish to customize the details further you can do it from that page.  The mod is associated with the file name of the map - if you resave the file it will update your level on the Steam Workshop.

---

## 8. Feedback and bug reports

Does this make sense? I hope so - feedback and bug reports always welcome : e-mail me at analytic@gmail.com .