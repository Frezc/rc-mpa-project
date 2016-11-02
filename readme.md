Multi-project solution.

##Getting Started

[**notice**] Make sure that you have Node.js v6 or newer installed on your machine.

Edit utils/configs.js to configure you project.

```
npm i

# generate dll for dev mode. (configs.libs)
npm run dev-dll

# run dev mode. (configs.pages)
npm run dev {page-name}

# for production
npm run build

open http://localhost:7991
```

use libs:
- React
- react-router
- Webpack
- Redux

Support [redux-devtools-extension](https://github.com/zalmoxisus/redux-devtools-extension), you can use chrome with this extension to debug.