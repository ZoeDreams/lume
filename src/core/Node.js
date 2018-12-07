import Class from 'lowclass'
import Mixin from './Mixin'
import 'geometry-interfaces'
import ImperativeBase, {initImperativeBase} from './ImperativeBase'
import { default as HTMLInterface } from '../html/HTMLNode'
import Scene from './Scene'
import {
    Object3D,
} from 'three'

console.log( 'goo' )

const radiansPerDegree = 1 / 360 * 2*Math.PI

initImperativeBase()

let Node = Mixin(Base =>

    Class('Node').extends( ImperativeBase.mixin( Base ), ({ Super }) => ({
        static: {
            defaultElementName: 'i-node',
        },

        /**
         * @constructor
         *
         * @param {Object} options Initial properties that the node will
         * have. This can be used when creating a node, alternatively to using the
         * setters/getters for position, rotation, etc.
         *
         * @example
         * var node = new Node({
         *   size: {x:100, y:100, z:100},
         *   rotation: {x:30, y:20, z:25}
         * })
         */
        constructor(options = {}) {
            const self = Super(this).constructor(options)

            // This was when using my `multiple()` implementation, we could call
            // specific constructors using specific arguments. But, we're using
            // class-factory style mixins for now, so we don't have control over the
            // specific arguments we can pass to the constructors, so we're just
            // using a single `options` parameter in all the constructors.
            //self.callSuperConstructor(Transformable, options)
            //self.callSuperConstructor(TreeNode)
            //self.callSuperConstructor(ImperativeBase)

            self._scene = null // stores a ref to this Node's root Scene.

            /**
             * @private
             * This method is defined here in the consructor as an arrow function
             * because parent Nodes pass it to Observable#on and Observable#off. If
             * it were a prototype method, then it would need to be bound when
             * passed to Observable#on, which would require keeping track of the
             * bound function reference in order to be able to pass it to
             * Observable#off later. See ImperativeBase#add and
             * ImperativeBase#remove.
             */
            self._onParentSizeChange = () => {

                // We only need to recalculate sizing and matrices if this node has
                // properties that depend on parent sizing (proportional size,
                // align, and mountPoint). mountPoint isn't obvious: if this node
                // is proportionally sized, then the mountPoint will depend on the
                // size of this element which depends on the size of this element's
                // parent. Align also depends on parent sizing.
                if (
                    self._properties.sizeMode.x === "proportional"
                    || self._properties.sizeMode.y === "proportional"
                    || self._properties.sizeMode.z === "proportional"

                    || self._properties.align.x !== 0
                    || self._properties.align.y !== 0
                    || self._properties.align.z !== 0
                ) {
                    self._calcSize()
                    self._needsToBeRendered()
                }
            }

            self._calcSize()
            self._needsToBeRendered()

            return self
        },

        makeThreeObject3d() {
            return new Object3D
        },

        /**
         * Get the Scene that this Node is in, null if no Scene. This is recursive
         * at first, then cached.
         *
         * This traverses up the scene graph tree starting at this Node and finds
         * the root Scene, if any. It caches the value for performance. If this
         * Node is removed from a parent node with parent.remove(), then the
         * cache is invalidated so the traversal can happen again when this Node is
         * eventually added to a new tree. This way, if the scene is cached on a
         * parent Node that we're adding this Node to then we can get that cached
         * value instead of traversing the tree.
         *
         * @readonly
         */
        get scene() {
            // NOTE: this._scene is initally null, created in the constructor.

            // if already cached, return it. Or if no parent, return it (it'll be null).
            if (this._scene || !this.parent) return this._scene

            // if the parent node already has a ref to the scene, use that.
            if (this.parent._scene) {
                this._scene = this.parent._scene
            }
            else if (this.parent instanceof Scene) {
                this._scene = this.parent
            }
            // otherwise call the scene getter on the parent, which triggers
            // traversal up the scene graph in order to find the root scene (null
            // if none).
            else {
                this._scene = this.parent.scene
            }

            return this._scene
        },

        /**
         * @private
         * This method to be called only when this Node has this.scene.
         * Resolves the _scenePromise for all children of the tree of this Node.
         */
        _giveSceneRefToChildren() {
            const children = this.subnodes;
            for (let i=0, l=children.length; i<l; i+=1) {
                const childNode = children[i]
                childNode._scene = this._scene
                childNode._giveSceneRefToChildren();
            }
        },

        _resetSceneRef() {
            this._scene = null

            const children = this.subnodes;
            for (let i=0, l=children.length; i<l; i+=1) {
                children[i]._resetSceneRef();
            }
        },
    }))

)

// TODO for now, hard-mixin the HTMLInterface class. We'll do this automatically later.
Node = Node.mixin(HTMLInterface)

export {Node as default}
