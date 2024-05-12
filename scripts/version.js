const pack = require('../package.json');
const fs = require('fs');
const { execSync } = require('child_process');

function getVersion() {
  const version = pack.version;
  const environment = process.env.ENVIRONMENT;
  const hash = execSync('git rev-parse HEAD').toString();
  const VERSION_TAG = `${environment}-${version}-${hash.trim('')}`;

  let data = fs.readFileSync('.env').toString();

  data = `${data}
VERSION_TAG=${VERSION_TAG}`;
  fs.writeFileSync(`.env`, data);
  return VERSION_TAG;
}

if (require.main === module) {
  console.log(getVersion());
}
