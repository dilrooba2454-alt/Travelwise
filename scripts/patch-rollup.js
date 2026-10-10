/**
 * Ensures Rollup falls back to @rollup/wasm-node if native DLL loading
 * is blocked by Windows Application Control or system security policies.
 */
const fs = require('fs');
const path = require('path');

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
