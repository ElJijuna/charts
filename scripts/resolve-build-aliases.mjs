import { cp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { replaceTscAliasPaths } from 'tsc-alias';

const root = resolve(import.meta.dirname, '..');
const nativeOutput = resolve(root, 'lib/native');

// Metro consumers receive TypeScript sources with portable relative imports.
await rm(nativeOutput, { recursive: true, force: true });
await cp(resolve(root, 'src'), nativeOutput, {
  recursive: true,
  filter: (file) =>
    !/(?:\.test\.[jt]sx?$|\.stories\.[jt]sx?$|\/(?:__tests__|__fixtures__|__mocks__|stories)(?:\/|$))/.test(
      file,
    ),
});

for (const output of ['commonjs', 'module', 'typescript/commonjs', 'typescript/module', 'native']) {
  const native = output === 'native';
  await replaceTscAliasPaths({
    configFile: resolve(root, 'tsconfig.build.json'),
    outDir: resolve(root, 'lib', output),
    resolveFullPaths: !native,
    resolveFullExtension: '.js',
    fileExtensions: {
      inputGlob: native ? '{ts,tsx}' : '{js,d.ts}',
      outputCheck: native ? ['ts', 'tsx'] : ['js', 'd.ts'],
    },
  });
}

// Keep native source imports extensionless for Metro's platform resolution.
for (const file of await readdir(nativeOutput, { recursive: true })) {
  if (!/\.tsx?$/.test(file)) {
    continue;
  }
  const filename = resolve(nativeOutput, file);
  const code = await readFile(filename, 'utf8');
  await writeFile(
    filename,
    code.replace(/((?:from\s+|import\(\s*)['"])(\.[^'"]+)\.tsx?(['"])/g, '$1$2$3'),
  );
}
