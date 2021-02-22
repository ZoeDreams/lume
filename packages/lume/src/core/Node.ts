import {autorun, booleanAttribute, element} from '@lume/element'
import {emits} from '@lume/eventful'
import {Mixin, MixinResult, Constructor} from 'lowclass'
import ImperativeBase, {initImperativeBase} from './ImperativeBase.js'
import {default as HTMLInterface} from '../html/HTMLNode.js'

// register behaviors that can be used on this element
import '../html/behaviors/ObjModelBehavior.js'
import '../html/behaviors/GltfModelBehavior.js'
import '../html/behaviors/ColladaModelBehavior.js'

import type {BaseAttributes} from './ImperativeBase.js'

initImperativeBase()

const _Node = Mixin(NodeMixin)

// TODO Make a way to link to examples that are in separate source files so as
// not to clutter the inline-documentation when viewing source files.

/**
 * @element lume-node
 * @class Node - `Node` is the backing class for `<lume-node>` elements, which are the most
 * primitive of the LUME elements.
 *
 * Node contains the basics that all objects in
 * a 3D scene need, such a transform (position, rotation, scale, etc), a size,
 * and reactivity.
 *
 * All objects in a 3D scene are an instance of `Node`, including more advanced
 * elements that render different types of visuals. For example, `<lume-sphere>`
 * is an element that renders a sphere on the screen and is backed by the
 * [`Sphere`](./Sphere) class which extends from `Node`.
 *
 * All Nodes must be a child of a [`Scene`](./Scene) node (`<lume-scene>`
 * elements) or another `Node` (or anything that extends from `Node`).
 * If a `<lume-node>` element is a child of anything else, it will not do
 * anything currently.
 *
 * The Node class (`<lume-node>` elements) is useful for the following:
 *
 * - Transform a parent node in 3D space, and it will transform all its
 *   children and grandchildren along with it. For example, if you scale a
 *   parent Node, then all its children are scaled along too.
 * - Transform child Nodes relative to their parent.
 * - Render traditional HTML content by placing any regular HTML elements as
 *   children of a `<lume-node>` element. See the next example.
 * - Extend the Node class to make new types of 3D objects relying on the basic
 *   features that Node provides. Other classes that extend from Node may, for
 *   example, create [layouts](/examples/autolayout-declarative), or render
 *   [WebGL content](/examples/material-texture).
 *
 * ## Example
 *
 * The following example shows traditional HTML content inside a 3D scene, as
 * well as the concept of a hierarchy of nodes called a "scene graph".
 *
 * Regular HTML content is places in each `<lume-node>` element. CSS is applied
 * to the nodes to give them rounded borders. Standard
 * [`<img />` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img)
 * are used display the sun images.
 *
 * We create a hierarchy of nodes. We give each node further down in the
 * hiearchy a smaller size. We use `align` and `mount-point` attributes to
 * align Nodes to one corner of their parent. `align` controls where a node is
 * mounted relative to their parent, and `mount-point` specifies the point in
 * the child that is aligned in the parent. See the [alignment guide](TODO)
 * for how that works.
 *
 * Each node has the same amount of rotation directly applied to it. Due to the
 * hiearchy, the rotations add up. The parent most node has the least
 * amount of rotation, and the child-most nodes have the most rotation and also
 * are more displaced due to rotation of their parents. See the [scene graph
 * guide](TODO) for details on how the hierarchy works.
 *
 * Finally, we listen to mouse or finger movement events in order to apply a
 * rotation to the root node based on the current mouse or finger position.
 * See the [events guide](TODO) for how the event system works.
 *
 * <div id="example1"></div> <script type="application/javascript">
 *   new Vue({
 *     el: '#example1',
 *     template: '<live-code :template="code" mode="html>iframe" :debounce="200" />',
 *     data: {
 *       code:
 * `<script src="${location.origin+location.pathname}/global.js"><\/script>
 *
 * <lume-scene id="scene">
 *   <lume-node
 *     id="container"
 *     size="78 78"
 *     align-point="0.5 0.5"
 *     mount-point="0.5 0.5"
 *   >
 *     <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *       <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *     </lume-node>
 *     <lume-node class="rotator A" size="60 60" align-point="1 1">
 *       <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *         <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *       </lume-node>
 *       <lume-node class="rotator" size="45 45" align-point="1 1">
 *         <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *           <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *         </lume-node>
 *         <lume-node class="rotator" size="28 28" align-point="1 1">
 *           <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *             <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *           </lume-node>
 *         </lume-node>
 *       </lume-node>
 *     </lume-node>
 *     <lume-node class="rotator A" size="60 60" mount-point="1 1">
 *       <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *         <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *       </lume-node>
 *       <lume-node class="rotator" size="45 45" mount-point="1 1">
 *         <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *           <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *         </lume-node>
 *         <lume-node class="rotator" size="28 28" mount-point="1 1">
 *           <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *             <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *           </lume-node>
 *         </lume-node>
 *       </lume-node>
 *     </lume-node>
 *     <lume-node class="rotator B" size="60 60" align-point="0 1" mount-point="1 0">
 *       <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *         <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *       </lume-node>
 *       <lume-node class="rotator" size="45 45" align-point="0 1" mount-point="1 0">
 *         <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *           <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *         </lume-node>
 *         <lume-node class="rotator" size="28 28" align-point="0 1" mount-point="1 0">
 *           <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *             <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *           </lume-node>
 *         </lume-node>
 *       </lume-node>
 *     </lume-node>
 *     <lume-node class="B" size="60 60" align-point="1 0" mount-point="0 1">
 *       <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *         <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *       </lume-node>
 *       <lume-node class="rotator" size="45 45" align-point="1 0" mount-point="0 1">
 *         <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *           <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *         </lume-node>
 *         <lume-node class="rotator" size="28 28" align-point="1 0" mount-point="0 1">
 *           <lume-node class="sun" size-mode="proportional proportional" size="0.8 0.8" position="0 0 10" align-point="0.5 0.5" mount-point="0.5 0.5">
 *             <img src="https://momlovesbest.com/wp-content/uploads/2020/03/A-UPF-Rating.png" />
 *           </lume-node>
 *         </lume-node>
 *       </lume-node>
 *     </lume-node>
 *   </lume-node>
 * </lume-scene>
 *
 * <style>
 *   html, body {
 *     margin: 0; padding: 0;
 *     height: 100%; width: 100%;
 *   }
 *   lume-scene { background: #fefefe }
 *   lume-node {
 *     border-radius: 100%;
 *     color: white;
 *     font-family: sans-serif;
 *     font-weight: bold;
 *   }
 *   lume-node:not(.sun) {
 *     background: rgba(0, 0, 0, 0.1);
 *   }
 *   img {
 *     width: 100%;
 *     height: 100%;
 *     display: block;
 *   }
 * </style>
 *
 * <script>
 *   LUME.useDefaultNames()
 *
 *   document.querySelectorAll('.A, .A .rotator').forEach(n => {
 *     n.rotation = (x, y, z, t) => [-65*Math.sin(t * 0.0005), y, -65*Math.sin(t * 0.0005)]
 *   })
 *
 *   document.querySelectorAll('.B, .B .rotator').forEach(n => {
 *     n.rotation = (x, y, z, t) => [65*Math.sin(t * 0.0005), 65*Math.sin(t * 0.0005), z]
 *   })
 *
 *   const rotationAmount = 35;
 *
 *   // Add some interaction so we can see the shine from the light!
 *   scene.addEventListener("pointermove", event => {
 *
 *     // Rotate the image a little bit too.
 *     container.rotation.y = (
 *       (event.clientX / scene.calculatedSize.x) * (rotationAmount * 2) -
 *       rotationAmount
 *     );
 *     container.rotation.x = -(
 *       (event.clientY / scene.calculatedSize.y) * (rotationAmount * 2) -
 *       rotationAmount
 *      );
 *   });
 * <\/script>
 * `
 *     },
 *   })
 * </script>
 *
 * NOTE, as opposed to the above example, Nodes can also be used as parents
 * nodes merely for transformation, but they do not have to render anything.
 * The only things that will appear on screen are other traditional
 * HTML elements or more advanced LUME elements that are placed inside of
 * the `<lume-node>` elements.  See an [example of that](/examples/hello3d-parent-transforms).
 *
 *
 * @extends ImperativeBase
 * @extends HTMLNode
 */
// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
export const Node = _Node.mixin(HTMLInterface)
export interface Node extends InstanceType<typeof Node> {}
export default Node

export type NodeAttributes = BaseAttributes | 'visible'

function NodeMixin<T extends Constructor>(Base: T) {
	// NOTE for now, we assume Node is mixed with its HTMLInterface.
	const Parent = ImperativeBase.mixin(Constructor<HTMLInterface>(Base))

	@element
	class Node extends Parent {
		static defaultElementName = 'lume-node'

		/**
		 * @property {boolean} visible - Whether or not the node will be
		 * visible (if it renders anything). For `<lume-node>` elements, this
		 * only applies if the element has CSS styling or traditional HTML
		 * content inside of it (children), otherwise `<lume-node>`
		 * element's don't have any visual output by default.  Other nodes that
		 * have default visual output like `<lume-box>` or `<lume-sphere>` will
		 * not be visible if this is false, and their rendering mechanics will
		 * be skipped.
		 *
		 * If a `Node` is not visible, its children are also not visible.
		 */
		@booleanAttribute(true) @emits('propertychange') visible = true

		/**
		 * @readonly
		 * @property {true} isNode - Always true for things that are or inherit from `Node`.
		 */
		isNode = true

		/**
		 * @constructor - Create a Node instance.
		 *
		 * The following examples calls `.set()` to set initial properties. Any
		 * properties passed into .set() are applied to the instance. For
		 * example, writing
		 *
		 * ```js
		 * var node = new Node().set({
		 *   size: {x:100, y:100, z:100},
		 *   rotation: {x:30, y:20, z:25}
		 * })
		 * ```
		 *
		 * is the same as writing
		 *
		 * ```js
		 * var node = new Node()
		 * node.size = {x:100, y:100, z:100}
		 * node.rotation = {x:30, y:20, z:25}
		 * ```
		 *
		 * @param {Object} props - An object with initial property values for the Node instance.@
		 * TODO describe the overall format and reactivity of the properties.
		 *
		 * @example
		 * // TODO handle @example blocks
		 */
		constructor(...args: any[]) {
			super(...args)

			// The `parent` property can already be set if this instance is
			// already in the DOM and wwhile being upgraded into a custom
			// element.
			// TODO Remove this after we make it lazy and deferred this to a
			// render task.
			if (this.parent) {
				this._calcSize()
				this.needsUpdate()
			}
		}

		protected _loadCSS() {
			if (!super._loadCSS()) return false

			this._cssStopFns.push(
				autorun(() => {
					this._elementOperations.shouldRender = this.visible
					this.needsUpdate()
				}),
			)

			return true
		}

		protected _loadGL() {
			if (!super._loadGL()) return false

			this._glStopFns.push(
				autorun(() => {
					this.three.visible = this.visible
					this.needsUpdate()
				}),
			)

			return true
		}
	}

	return Node as MixinResult<typeof Node, T>
}

import type {ElementAttributes} from '@lume/element'

declare module '@lume/element' {
	namespace JSX {
		interface IntrinsicElements {
			'lume-node': ElementAttributes<Node, NodeAttributes>
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'lume-node': Node
	}
}
