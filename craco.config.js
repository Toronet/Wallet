const CracoLessPlugin = require("craco-less");

//@: Antd configurations
module.exports = {
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            modifyVars: {
              "@primary-color": "#05a165",
              "@text-selection-bg": "#1890FF",
              "@font-family": "Montserrat, sans-serif",
              "@layout-header-background": "#ffffff",
              "@layout-footer-background": "#ffffff",  
              "@menu-bg": "#ffffff",
              "@menu-item-active-bg": "#ebfcf5",
            },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};