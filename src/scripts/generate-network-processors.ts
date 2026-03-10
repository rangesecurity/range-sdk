import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
} from 'fs';
import { join } from 'path';

interface ProcessorInfo {
  className: string;
  filePath: string;
  networks: string[];
  importPath: string;
}

function resolveNetworkConstant(
  constantName: string,
  srcDir: string
): string[] {
  const docHelperPath = join(srcDir, 'utils/doc-helper.ts');
  if (!existsSync(docHelperPath)) {
    return [];
  }

  const docHelperContent = readFileSync(docHelperPath, 'utf8');
  // Match: export const CONSTANT_NAME: INetwork[] = ['network1', 'network2', ...];
  const constantMatch = docHelperContent.match(
    new RegExp(
      `export const ${constantName}:\\s*INetwork\\[\\]\\s*=\\s*\\[([^\\]]+)\\]`,
      's'
    )
  );

  if (!constantMatch) {
    // Try to match constants that reference other constants (e.g., DISTRIBUTION_NETWORKS = COSMOS_NETWORKS)
    const refMatch = docHelperContent.match(
      new RegExp(
        `export const ${constantName}:\\s*INetwork\\[\\]\\s*=\\s*(\\w+)`,
        's'
      )
    );
    if (refMatch) {
      // Recursively resolve the referenced constant
      return resolveNetworkConstant(refMatch[1], srcDir);
    }
    return [];
  }

  const networksStr = constantMatch[1];
  return networksStr
    .split(',')
    .map((n) => n.trim().replace(/['"]/g, ''))
    .filter((n) => n.length > 0);
}

function extractProcessorInfo(
  filePath: string,
  relativePath: string,
  srcDir: string
): ProcessorInfo | null {
  const content = readFileSync(filePath, 'utf8');

  // Extract class name from export statement
  // Match classes that extend BlockProcessor, TickProcessor, OnBlockHelper, or OnTickHelper
  const classMatch = content.match(
    /export class (\w+) extends (BlockProcessor|TickProcessor|OnBlockHelper|OnTickHelper)/
  );
  if (!classMatch) return null;

  const className = classMatch[1];

  // Extract networks from @Rule decorator - handle both array literals and constant references
  // First try to match array literal: networks: ['network1', 'network2']
  const ruleMatch = content.match(
    /@Rule(?:<[^>]+>)?\s*\(\s*\{[\s\S]*?networks:\s*\[([^\]]+)\]/
  );

  let networks: string[] = [];

  if (ruleMatch) {
    // Found array literal
    const networksStr = ruleMatch[1];
    networks = networksStr
      .split(',')
      .map((n) => n.trim().replace(/['"]/g, ''))
      .filter((n) => n.length > 0);
  } else {
    // Try to match constant reference: networks: COSMOS_NETWORKS
    const constantMatch = content.match(
      /@Rule(?:<[^>]+>)?\s*\(\s*\{[\s\S]*?networks:\s*(\w+)/
    );
    if (constantMatch) {
      const constantName = constantMatch[1];
      networks = resolveNetworkConstant(constantName, srcDir);
    }
  }

  if (networks.length === 0) return null;

  // Convert file path to import path (remove .ts extension and adjust for dist)
  // Since the generated file is in dist/processors/, we need to remove the 'processors/' prefix
  let importPath = relativePath.replace(/\.ts$/, '');
  // Remove 'processors/' prefix if present (since generated files are already in processors dir)
  if (importPath.startsWith('processors/')) {
    importPath = importPath.replace(/^processors\//, '');
  }

  return {
    className,
    filePath,
    networks,
    importPath,
  };
}

function findProcessorFiles(
  dir: string,
  baseDir: string,
  processors: ProcessorInfo[] = []
): ProcessorInfo[] {
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = join(dir, file.name);

    if (file.isDirectory()) {
      // Skip node_modules and other non-processor directories
      if (!['node_modules', 'dist'].includes(file.name)) {
        findProcessorFiles(fullPath, baseDir, processors);
      }
    } else if (
      file.name.endsWith('.ts') &&
      !file.name.includes('.spec.') &&
      file.name !== 'processors.ts' &&
      file.name !== 'taskProcessor.ts'
    ) {
      const relativePath = fullPath.replace(baseDir + '/', '');
      const info = extractProcessorInfo(fullPath, relativePath, baseDir);
      if (info) {
        processors.push(info);
      }
    }
  }

  return processors;
}

function generateNetworkProcessorFile(
  network: string,
  processors: ProcessorInfo[]
): string {
  const exports = processors
    .map((p) => {
      // ES modules require .js extension in import paths
      return `export { ${p.className} } from './${p.importPath}.js';`;
    })
    .join('\n');

  return exports + '\n';
}

function main() {
  // Read from src, write to dist
  const projectRoot = join(__dirname, '../..');
  const srcDir = join(projectRoot, 'src');
  const processorsDir = join(srcDir, 'processors');
  const distProcessorsDir = join(projectRoot, 'dist', 'processors');

  console.log('Scanning for processors in:', processorsDir);

  // Find all processor files
  const allProcessors = findProcessorFiles(processorsDir, srcDir);

  console.log(`Found ${allProcessors.length} processors`);

  // Group processors by network
  const processorsByNetwork = new Map<string, ProcessorInfo[]>();

  for (const processor of allProcessors) {
    for (const network of processor.networks) {
      if (!processorsByNetwork.has(network)) {
        processorsByNetwork.set(network, []);
      }
      processorsByNetwork.get(network)!.push(processor);
    }
  }

  console.log(
    `Found networks: ${Array.from(processorsByNetwork.keys()).join(', ')}`
  );

  // Ensure dist/processors directory exists
  if (!existsSync(distProcessorsDir)) {
    mkdirSync(distProcessorsDir, { recursive: true });
  }

  // Generate a processor file for each network
  for (const [network, processors] of processorsByNetwork.entries()) {
    const fileName = `processors-${network}.js`;
    const filePath = join(distProcessorsDir, fileName);
    const content = generateNetworkProcessorFile(network, processors);

    writeFileSync(filePath, content, 'utf8');
    console.log(`Generated ${fileName} with ${processors.length} processors`);
  }

  console.log('Network-specific processor files generated successfully!');
}

main();
