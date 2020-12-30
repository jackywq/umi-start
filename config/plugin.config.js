import ThemeColorReplacer from 'webpack-theme-color-replacer';
import generate from '@ant-design/colors/lib/generate';
import path from 'path';

function getModulePackageName(module) {
  if (!module.context) return null;
  const nodeModulesPath = path.join(__dirname, '../node_modules/');

  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName;

  if (packageName && packageName.match('^_')) {
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}

export default config => {
  // 设置 alias
  config.resolve.alias.set('@', path.join(__dirname, '../src'));

  config.optimization.runtimeChunk(false).splitChunks({
    chunks: 'async',
    name: 'vendors',
    maxInitialRequests: Infinity,
    minSize: 0,
    cacheGroups: {
      vendors: {
        test: module => {
          const packageName = getModulePackageName(module);

          if (packageName) {
            return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
          }

          return false;
        },

        name(module) {
          const packageName = getModulePackageName(module);

          if (packageName) {
            if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
              return 'viz'; // visualization package
            }
          }

          return 'misc';
        },
      },
    },
  });
};

const getAntdSerials = color => {
  const lightNum = 9;
  const devide10 = 10; // 淡化（即less的tint）

  const lightens = new Array(lightNum).fill(undefined).map((_, i) => {
    return ThemeColorReplacer.varyColor.lighten(color, i / devide10);
  });
  const colorPalettes = generate(color);
  return lightens.concat(colorPalettes);
};
