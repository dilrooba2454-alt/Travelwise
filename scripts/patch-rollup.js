/**
 * Ensures Rollup falls back to @rollup/wasm-node if native DLL loading
 * is blocked by Windows Application Control or system security policies.
 * Written in ES Module syntax compatible with "type": "module" on Node 18-24.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

try {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const nativeJsPath = path.join(__dirname, '..', 'node_modules', 'rollup', 'dist', 'native.js');

  if (fs.existsSync(nativeJsPath)) {
    let content = fs.readFileSync(nativeJsPath, 'utf8');
    if (!content.includes("@rollup/wasm-node/dist/native.js")) {
      const target = "const requireWithFriendlyError = id => {\n\ttry {\n\t\treturn require(id);\n\t} catch (error) {";
      const replacement = `const requireWithFriendlyError = id => {\n\ttry {\n\t\treturn require(id);\n\t} catch (error) {\n\t\ttry {\n\t\t\treturn require('@rollup/wasm-node/dist/native.js');\n\t\t} catch (wasmError) {}`;
      if (content.includes(target)) {
        content = content.replace(target, replacement);
        fs.writeFileSync(nativeJsPath, content, 'utf8');
        console.log('✅ Rollup wasm fallback successfully configured.');
      }
    }
  }
} catch (err) {
  // If patching is not needed or fails on non-Windows environments, exit cleanly
  console.log('Rollup patch notice:', err.message);
}
