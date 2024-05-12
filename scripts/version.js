const pack = require('../package.json');
const { execSync } = require('child_process');

function getVersion() {
  const version = pack.version;
  const environment = process.env.ENVIRONMENT;
  const hash = execSync('git rev-parse HEAD').toString();
  execSync(`export VERSION_TAG=${environment}-${version}-${hash.trim('')}`);
  return `${environment}-${version}-${hash.trim('')}`;
}

if (require.main === module) {
  console.log(getVersion());
}
