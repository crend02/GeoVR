# Repository Structure
This repository more or less follows the gitflow structure, without a `develop`
branch: Build your features on separate branches, and pull request to `master`.

The `gh-pages` branch contains the current build of the application, which is
available under [crend02.github.io/GeoVR](https://crend02.github.io/GeoVR).

# Build Setup
For development `node.js` 6+ is required.

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:3000
npm run dev

# build for production with minification
npm run build
```

# Architecture
The aframe framework builds upon an *entity-component-system*, allowing modular
definition of functionality, which can be attached to any object within the
3D-scene.
This means that the implementation only consists of such components, which are
mostly attached to the controller entities, as well as the 3D spheres.

# Data formats & sources

## Surrounding buildings
In order to simulate the surrounding environment i.e. buildings present in
surrounding area, COLLADA model was used. COLLADA model is an interchange file
format for interactive 3D applications.
The model was prepared using an opensource plugin in QGIS software called
Qgis2threejs. The tool allows to take shapefiles as input and convert it to
3D buildings given a specified height ratio.
The model can then be exported in different file formats including COLLADA
model.
The model then can simply imported in AFrame and must be scaled manually.

![area of interest screenshot](aoi.png)

Data to be used in Qgis2threejs was downloaded from openStreetMap via Overpass.
The main files required were the boundary areas for individual buildings.
The area to be reconstructed was also differentiated from environment and
exported as separate layer. It helps in marking the area of interest and
differentiating it from the surrounding area in virtual environment.
