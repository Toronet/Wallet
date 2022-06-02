# Toronet Client

TóróNet is a platform built for financial aspirations of human communities, specifically beyond the reach of the traditional financial industry as well as most blockchain platforms.

Tóró token is the basic token of the TóróNet platform. The Tóró is a stablecoin backed by true reserves.

## The Technology

The Toronet dashboard client is proudly powered by popular javascript "framework" **React.js (v18)**. Other major technologies used include: **Typescript**, **Antd (v4) (CSS component lib)**, **React-router-dom (v6)** & the **Redux toolkit** for State management.

## Screenshots

## ![landing-page](/screenshots/screen-1.png)

![dashboard](/screenshots/screen-3.png)

## How to use

To get started with a local copy of the Toronet web dashboard, clone this repo or download the source code via Github then execute the following commands in the root of the project's terminal in the exact order given below.

```js
npm install
```

```js
npm start
```

## Folder structure walkthrough

The codebase is broken down into serveral sections. Find below a brief breakdown of each section and their corresponding responsibilties.

- **Assets**: Like the name implies, this is the folder were all assets (images, animations, videos etc) are kept.

- **Components**: The component folder is split into 3 parts;

  - **base components**: Base components are fundamental components like buttons, tabs etc that can be used to build pieces of the UI
  - **UI components**: Ui components are like base components only they are more larger in terms of scope. They are elements like a confirmation modal, a tab screen, a banner card etc..
  - **Utility components**: These are helper components / HOC's that contain specific rules or functionality to assist other components or pages.

- **Constants**: Constants are were data that are used in key sections of the project are kept. They can't be mutated or changed.

- **Helpers**: Helpers are where functions that abstract some logic to make it easier on other functions are kept. The primary axios helper is kept here. Mostly used in the data layer of the project.

- **Hooks**: These are where custom react hooks are kept and managed.

- **Pages**: These are where all pages in the project are kept and managed.

- **Redux**: This is the brain of the project. The data layer and global state are kept and managed here. All API calls are "batched" into actions. Knowledge of redux is required before touching anything here!

- **Styles**: This is where all the global style module is kept, alongside other _LESS_ partials like **variables**, and **mixins**.

- **Utils**: These are utility functions that help perform certain actions like; capitalize a text, format a number to a comma separated string etc... Not to be confused with the helpers. These are used
  in the other components or pages.
