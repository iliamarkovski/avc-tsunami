export function versionToNumber(version: string): number {
  if (typeof version !== 'string') {
    throw new TypeError('version must be a string');
  }

  const cleaned = version.split('.').join('');

  if (!/^\d+$/.test(cleaned)) {
    throw new Error(`Invalid version format: ${version}`);
  }

  return Number(cleaned);
}
