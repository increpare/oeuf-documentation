#!/usr/bin/env node
/**
 * One-time script: renames image files for entity/object term swap.
 * entity_* (specific) -> object_*,  object_tool_* (general) -> entity_tool_*
 * Run from repo root: node rename-entity-object.js
 */
const fs = require('fs');
const path = require('path');
const dir = path.join(__dirname, 'map-editor-images');

const entityToObject = [
  'entity_1_Bonfire_Start.png',
  'entity_2_Bonfire.png',
  'entity_3_Bonfire_End.png',
  'entity_4_Torch.png',
  'entity_5_Star.png',
  'entity_6_Chair.png',
  'entity_7_Table.png',
  'entity_torch_example.png',
  'entity_chair_example.png',
  'entity_table_example.png',
].map((old) => [old, old.replace(/^entity_/, 'object_')]);

const objectToEntity = [
  ['object_tool_entity.png', 'entity_tool_object.png'],
  ['object_tool_trigger.png', 'entity_tool_trigger.png'],
  ['object_mode.png', 'entity_mode.png'],
];

[...entityToObject, ...objectToEntity].forEach(([oldName, newName]) => {
  const oldPath = path.join(dir, oldName);
  const newPath = path.join(dir, newName);
  if (fs.existsSync(oldPath)) {
    fs.renameSync(oldPath, newPath);
    console.log(oldName, '->', newName);
  }
});
console.log('Image renames done.');
