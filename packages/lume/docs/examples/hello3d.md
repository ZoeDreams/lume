# Hello 3D

<!-- <live-code class="full" :options="{theme: 'base16-light'}" template="#rotating-square" :autorun="true" />
<script type="text/x-template" id="rotating-square"><template>
  <lume-scene>
    <lume-node ref="node"
      size="100 100"
      align-point="0.5 0.5 0.5"
      mount-point="0.5 0.5 0.5"
    >
      Hello 3D
    </lume-node>
  </lume-scene>
</template>

<style>
  lume-node {
    background: deeppink;
  }
</style>

<script>
  LUME.useDefaultNames()

  export default {
    mounted() {
      const node = this.$refs.node
      node.rotation = (x, y, z) => [x, ++y, z]
    },
  }
&lt;/script></script> -->

<div id="example"></div>
<script type="application/javascript">
  new Vue({
    el: '#example',
    template: '<live-code class="full" :template="code" mode="html>iframe" :debounce="200" />',
    data: {
      code:
`
<script src="${location.origin+location.pathname}/global.js"><\/script>

<lume-scene>
  <lume-node
    id="node"
    size="100 100"
    rotation="0 -70 0"
    align-point="0.5 0.5 0.5"
    mount-point="0.5 0.5 0.5"
  >
    <h3 align="center">Hello 3D world!</h3>
  </lume-node>
</lume-scene>

<style>
  html, body {
    margin: 0; padding: 0;
    height: 100%; width: 100%;
  }
  lume-scene {
    background: #333;
  }
  lume-node {
    background: deeppink;
    font-family: sans serif;
    border-radius: 5px;
  }
</style>

<script>
  LUME.useDefaultNames()
  node.rotation = (x, y, z) => [x, ++y, z]
<\/script>

`
    },
  })
</script>
