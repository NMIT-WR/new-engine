#!/usr/bin/env node
import fs from 'node:fs';

/**
 * Read a CLI argument value following the given flag.
 * @param {string} name
 * @returns {string | null}
 */
function readArg(name) {
  const index = process.argv.indexOf(name);
  if (index === -1 || index + 1 >= process.argv.length) return null;
  return process.argv[index + 1];
}

const inputPath = readArg('--input');
const outputPath = readArg('--output');

if (!inputPath || !outputPath) {
  console.error('Usage: storybook-a11y-summary.mjs --input <report.json> --output <summary.md>');
  process.exit(1);
}

let raw;
try {
  raw = fs.readFileSync(inputPath, 'utf8');
} catch (err) {
  console.error(`Failed to read input file: ${inputPath}`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`Failed to parse JSON from: ${inputPath}`);
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

if (!Array.isArray(data)) {
  console.error('Expected report.json to be an array of stories.');
  process.exit(1);
}

/**
 * Identify APCA-related violations by id or tags.
 * @param {{id?: string, tags?: string[]}} violation
 * @returns {boolean}
 */
function isApcaViolation(violation) {
  const id = String(violation?.id ?? '').toLowerCase();
  const tags = Array.isArray(violation?.tags) ? violation.tags : [];
  return id.includes('apca') || tags.some((tag) => String(tag).toLowerCase().includes('apca'));
}

/**
 * Escape pipe characters for Markdown tables.
 * @param {string} value
 * @returns {string}
 */
function escapePipes(value) {
  return String(value).replace(/\|/g, '\\|');
}

const groupStats = new Map();
const storyRows = [];

let totalStories = data.length;
let storiesWithViolations = 0;
let totalViolations = 0;
let apcaViolations = 0;

for (const story of data) {
  const title = story?.title ?? 'Unknown';
  const name = story?.name ?? story?.storyId ?? 'Unknown';
  const violations = story?.results?.violations ?? [];
  const violationCount = violations.length;
  const apcaCount = violations.filter(isApcaViolation).length;

  totalViolations += violationCount;
  apcaViolations += apcaCount;
  if (violationCount > 0) {
    storiesWithViolations += 1;
  }

  const groupName = String(title).split('/')[0]?.trim() || 'Other';
  const group = groupStats.get(groupName) ?? {
    stories: 0,
    storiesWithViolations: 0,
    violations: 0,
    apca: 0,
  };
  group.stories += 1;
  group.violations += violationCount;
  group.apca += apcaCount;
  if (violationCount > 0) {
    group.storiesWithViolations += 1;
  }
  groupStats.set(groupName, group);

  storyRows.push({
    story: `${title} / ${name}`,
    violations: violationCount,
    apca: apcaCount,
  });
}

const lines = [];
lines.push('# Storybook A11y Report');
lines.push('');
lines.push(`- Total stories: ${totalStories}`);
lines.push(`- Stories with violations: ${storiesWithViolations}`);
lines.push(`- Total violations: ${totalViolations}`);
lines.push(`- APCA violations: ${apcaViolations}`);
lines.push('');
lines.push('## By group');
lines.push('');
lines.push('| Group | Stories | Stories w/ violations | Violations | APCA |');
lines.push('| --- | --- | --- | --- | --- |');

const sortedGroups = Array.from(groupStats.entries()).sort((a, b) => a[0].localeCompare(b[0]));
for (const [groupName, stats] of sortedGroups) {
  lines.push(
    `| ${escapePipes(groupName)} | ${stats.stories} | ${stats.storiesWithViolations} | ${stats.violations} | ${stats.apca} |`,
  );
}

const violatingRows = storyRows
  .filter((row) => row.violations > 0)
  .sort((a, b) => {
    if (b.violations !== a.violations) return b.violations - a.violations;
    if (b.apca !== a.apca) return b.apca - a.apca;
    return a.story.localeCompare(b.story);
  });

lines.push('');

if (violatingRows.length === 0) {
  lines.push('No violations found.');
} else {
  lines.push('<details>');
  lines.push('<summary>Stories with violations</summary>');
  lines.push('');
  lines.push('| Story | Violations | APCA |');
  lines.push('| --- | --- | --- |');
  for (const row of violatingRows) {
    lines.push(`| ${escapePipes(row.story)} | ${row.violations} | ${row.apca} |`);
  }
  lines.push('');
  lines.push('</details>');
}

fs.writeFileSync(outputPath, `${lines.join('\n')}\n`, 'utf8');
