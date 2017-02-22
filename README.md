# GeoVR - Urban Planning
This is the result of a study project in winter term 2016/17 at [ifgi](https://ifgi.de).

The goal of this study project was to built a Virtual Reality application which would facilitate the envisionment of urban planning for citizens.
In particular it covers the "Hamannplatz" area in Muenster Coerde, Germany.
To achieve this goal we used the web based VR framework [A-frame](https://aframe.io/).

## Demo
If you have an HTC Vive with accompanying controllers,
[click here to try it out!](https://crend02.github.io/GeoVR).

For all the other people, there's a [**product video**](TODO).

## Documentation
* [**User docs**](docs/USER.md) - explanation of functionality & controls
* [**Developer docs**](docs/DEVEL.md) - insights into architecture & build instructions

## Technologies
* [A-frame](https://aframe.io/) WebVR Framework
* ES6 & webpack
* .obj Models were created with [MagicanVoxel](https://ephtracy.github.io/)
* [OSMOverpass Turbo API](https://overpass-turbo.eu/) we collected data of the studing area.
* [qgis2threejs-plugin](http://qgis2threejs.readthedocs.io/en/docs-release/) to provide the geographic planning data as a .dae & .obj Models

## Project Management
The project team used the SCRUM software development method in combination with
weekly hackathons. The developers of the project are:

* ![alt GitHub][githublogo] [Norwin Roosen](https://github.com/noerw)
* ![alt GitHub][githublogo] [Clara Rendel](https://github.com/crend02)
* ![alt GitHub][githublogo] [Saad Sarfraz](https://github.com/saadsarfrazz)
* ![alt GitHub][githublogo] [Marc Dragunski](https://github.com/mdragunski)
* ![alt GitHub][githublogo] [Marike Meijer](https://github.com/marikemau)

## Limitations & Future Work
During the planning process one of the requirements was to save and store the
current session in the buildingview as a map. The necessary import and export
function should be one of the feature that could be implemented in future work.

Further proposed features are...

* advanced manipulation of objects (scaling)
* creation of new object types by drawing
* in-VR editing of constraint rules
* Interface for changing basic data sets (planning area, photos, collada model)

## License
The code included in this repository is licensed under [GPL-3.0](LICENSE).

[githublogo]: http://i.imgur.com/0o48UoR.png
