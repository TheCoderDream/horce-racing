<template>
  <div class="container">
    <header>
      <h1>{{title}}</h1>
      <div class="controls">
        <slot name="controls" />
      </div>
    </header>
    <main>
      <section class="side-panel-left">
        <slot name="sidePanelLeft" />
      </section>
      <section class="main-area">
        <slot name="mainArea" />
      </section>
      <section class="side-panel-right">
        <div class="program">
          <slot name="sidePanelRight" />
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
defineProps(
    {
      title: {default: 'Horse Racing'}
    }
)
</script>

<style scoped>
.container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 1rem;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #e57373;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}
.controls{
  display: flex;
  gap: 10px
}
main {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}
.side-panel-left {
  flex: 1 1 30%;
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  overflow-y: auto;
}
.main-area {
  flex: 2 1 40%;
  background: #eee;
  border-radius: 8px;
  padding: 1rem 3rem 1rem 1rem;
  min-width: 400px;
}
.side-panel-right  {
  flex: 1 1 30%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.program {
  background: #f9f9f9;
  border-radius: 8px;
  padding: 1rem;
  min-height: 200px;
}
</style> 