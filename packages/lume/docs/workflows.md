# Workflows

## Global Workflow (easiest)

<!-- TODO: move some info from here to the install.md file, then delete this. -->

In this workflow we'll write HTML (a "declarative programming language") to
define the 3D scene, and only a small sprinkle of JavaScript (an "imperative
programming language") to animate the rectangle.

Make a file named `index.html` containing the following:

```html
<style>
	html,
	body {
		/* Make the app full width/height of the viewport. */
		width: 100%;
		height: 100%;
		margin: 0;

		/* Give the app a background color. */
		background: #333;
	}

	lume-node {
		/* Give the rotating rectangle (the lume-node below) a pink color. */
		background: pink;
	}
</style>

<!-- Define a 3D scene. -->
<lume-scene>
	<!--
		The <lume-node> is a basic element that is rendered with CSS.

		Here we give it "proportional" sizing along the X nd Y axes, which
		means it will be sized relative to the size of its parent (in this
		case the parent is the <lume-scene> element). The <lume-node> will have 75%
		or the width and height of the scene width and height.

		The align and mount-point properties have values that center the
		<lume-node> rectangle in the center of the view.
	-->
	<lume-node size-mode="proportional proportional" size="0.75 0.75" align-point="0.5 0.5" mount-point="0.5 0.5">
		<!-- Put some italicized text inside of it. -->
		<i>Hello 3D</i>
	</lume-node>
</lume-scene>

<!-- Include the global version of Lume in the app. -->
<script src="https://unpkg.com/lume/dist/global.js"></script>

<script>
	// Tell Lume to use default names for the elements (f.e. lume-node and lume-scene).
	LUME.useDefaultNames()

	// Get a reference to the lume-node element.
	const node = document.querySelector('lume-node')

	// Define a "property function" to increment only the Y rotation. This
	// increments rotation around the Y axis by 1 degree every time the scene
	// re-renders (which is usually 60fps unless the framerate decreases for
	// graphically intensive scenes).
	node.rotation = (x, y, z) => [x, ++y, z]
</script>
```

Now use `File > Open` in your web browser to open the `index.html` file and see the
result.

## Webpack Workflow

In this workflow we'll use a build tool called
[Webpack](https://webpack.js.org) to bundle our application code into a
single file that can be loaded into a web app via `<script>` tag.

Make a folder somewhere on your computer, then open it in your terminal. (What is a Terminal?)

Install [Node.js](http://nodejs.org), then install
[`webpack`](https://webpack.js.org) in your project:

```sh
npm install "webpack@^3" --save-dev
```

The `--save-dev` option saves webpack as a ["dev
dependency"](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file).

Install Lume into your project:

```sh
npm install lume --save
```

Create a file named `webpack.config.js` to configure Webpack:

```js
module.exports = {
	entry: './app.js',
	output: {
		path: './output',
		filename: 'app.js',
	},
}
```

Make a file named `app.js` containing the following:

```js
import {Scene, Node, useDefaultNames} from 'lume'

// Tell Lume to use default names for the elements.
useDefaultNames()

// Create a new 3D scene:
const scene = new Scene()

// Add a 3D node into the scene tree.
const node = new Node({
	// Make the node take up 75% of the width and height of the scene viewport.
	sizeMode: ['proportional', 'proportional'],
	size: [0.75, 0.75],

	// Position the node in the center of the view.
	alignPoint: [0.5, 0.5],
	mountPoint: [0.5, 0.5],
})

node.innerHTML = '<div>Hello 3D</div>'

scene.add(node)
scene.mount(document.body)

node.rotation = (x, y, z) => [x, ++y, z]
```

Make a file named `output/index.html` in your poject containing the following:

```html
<!DOCTYPE html>
<style>
	html,
	body {
		width: 100%;
		height: 100%;
		margin: 0;
		padding: 0;
		background: #333;
	}

	lume-node {
		background: pink;
	}

	div {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		text-align: center;
	}
</style>
<script src="./app.js"></script>
```

then compile a bundle that we'll run in the browser by running the following in your command line:

```sh
npx webpack
```

The `npx webpack` command runs the Webpack build tool and outputs a bundle to
the file `output/app.js` within your project, which includes your code as
well as the Lume code that you imported with the `import` statements.

Now use `File > Open` in your browser to open the `output/index.html` file and
see the result.

# What's next?

Now that you're up and running, learn more in the [Guide](#) (coming soon...) and [API
reference](./api/core/Node).
