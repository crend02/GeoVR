
## Usage & Functionality
The application allows the user to desginate areas to specific landuses by
placing visual representation of these uses onto the planning area.
The planning area is pre-populated with 360° imagery of the current state of
the area to provide better orientation within the VR environment.

### Controller Mapping
This is the mapping of controller buttons that is used for the functionality
explained below:

![left hand](left-controller.png)

![right hand](right-controller.png)

Movement of the player is handled via a **teleport mechanic**.
Moving in 3D immersive environment is one key basic task a user wants to
perform. This functionality was implemented using `aframe-teleport-controls`
component. The user can teleport to a distant point by pointing to that place
and pressing the right-hand controllers trackpad.
A curved ray displays the user pointing direction. It also responds to the user
if the teleport is feasible for the pointed location: It changes its color
from green to red when pointing to a restricted location (e.g. the sky).

![teleporting](teleport.png)

### View Modes
Two modes ('planning view' & 'photo view')were implemented to provide different
views onto the planning area.
After launching the application and entering VR mode (press `f`), the user is
located in the planning view, with two hand-tracked controllers to use.

#### 3D Photo view
The application contains a 3D photo view to give the user a brief overview of
the current state of Hamannplatz. This view was built by 8 different 360° photos
which should provide orientation in an abstract VR-environment. Furthermore, the
user has the possibility to switch around the photoview caused by selecting a
green sphere. The green spheres point to the following  360° photo regarding the
users latest positions.
In the Photo view the User has following capabilities:

* Use the trigger to switch to 3D Photoview/Planning View
* Use the laserpointer to select one of the spheres to switch around

#### Planning view
In the planning view the user is placed within a virtual representation of the
planning area. The area of interest is represented by a white colored shape,
surrounded by red shapes of the buildings that are currently present.
Spheres that show a 360°-photo of the current state while beeing pointed at are
placed at their correct position in relation to the area of interest.

![area of interest](aoi.png)

The user user can select, rotate, place, move or delete objects
with the left controller. There are ten different object types defined. While
selecting an object, the objects preview will be shown at the pointed grid
cell. It is green or red according to whether it can be placed or not (see
[contraints](#constraints)). Additionally, it is only possible to place objects
within the defined area of interest.

##### Constraints
Constraints are certain requirements which have to be satisfied in order to place
an object. These are different for every object type, and declaratively defined
in [`src/constraints.json`](https://github.com/crend02/GeoVR/blob/master/src/constraints.json).
For example, a tree has to be place on a green area and a footpath has to be
placed next to a street or parking area. If the constraint is fulfilled the
objects preview will be displayed in green. If not, the preview will be
displayed in red and an information will be displayed explaining why the object
cannot be placed.

![failing constraint](constraint_forbidden.png)

![fulfilled constraint](constraint_allowed.png)
