const fs = require('fs');
const { execSync } = require('child_process');
const pack = require('../package.json');

const ENV_KEYS = [
  'NODE_ENV',
  'ENVIRONMENT',
  'BACKEND_PORT',
  'DB_HOST',
  'DB_PORT',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE',
  'JWT_SECRET_KEY',
  'EXPIRES_IN',
  'SUPER_ADMIN_EMAIL',
  'SUPER_ADMIN_PASSWORD',
  'SMTP_EMAIL',
  'SMTP_HOST',
  'SMTP_PORT',
  'DEFAULT_USER_PASSWORD',
  'FRONT_END_BASE_URL',
  'NEXT_PUBLIC_API_BASE_URL',
  'WEB_PORT',
];

const start = async () => {
  console.log('initializing variables...');
  const version = pack.version;
  const environment = process.env.ENVIRONMENT;

  const hash = execSync('git rev-parse HEAD').toString();

  const env = ENV_KEYS.reduce(
    (acc, curr) => ({
      ...acc,
      [curr]: process.env[curr],
    }),
    {},
  );

  console.log(process.env.ENVIRONMENT);

  console.log(hash);

  let data = fs.readFileSync('./terraform/terraform.tfvars.tpl').toString();

  let provider = fs.readFileSync('./terraform/provider.tf.tpl').toString();

  data = data.replace('__AWS_ACCESS_KEY__', process.env.AWS_ACCESS_KEY_ID);
  data = data.replace('__AWS_SECRET_KEY__', process.env.AWS_SECRET_ACCESS_KEY);
  data = data.replace('__AWS_REGION__', process.env.AWS_DEFAULT_REGION);
  data = data.replace('__ENVIRONMENT__', process.env.ENVIRONMENT);
  data = data.replace('__ENVIRONMENT_VARIABLES__', JSON.stringify(env));
  data = data.replace(
    '__IMAGE_TAG__',
    `${environment}-${version}-${hash.trim('')}`,
  );

  fs.writeFileSync(`./terraform/terraform.auto.tfvars`, data);

  provider = provider.replace('__WORKSPACE__', `azentia-${environment}`);

  fs.writeFileSync(`./terraform/provider.tf`, provider);

  console.log('done....');
};

if (require.main === module) {
  start();
}
