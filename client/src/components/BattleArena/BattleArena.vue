<script setup>
import { computed } from "vue";

const props = defineProps(["character", "ajime"]);

const kirbyState = computed(() => {
  const selected = props.character.type === "kirby";
  const kirbyStatus = urlFromStatus(selected);
  return {
    selected,
    imgUrl: require(`../../../public/images/kirby/kirby_${kirbyStatus(
      props.character.status
    )}.png`),
  };
});

const knightState = computed(() => {
  const selected = props.character.type === "knight";
  const knightStatus = urlFromStatus(selected);
  return {
    selected,
    imgUrl: require(`../../../public/images/knight/knight_${knightStatus(
      props.character.status
    )}.png`),
  };
});

const inverted = {
  start: "start",
  win: "lose",
  lose: "win",
};

function urlFromStatus(selected) {
  if (selected) {
    return (status) => status;
  }
  return (status) => inverted[status];
}
</script>

<style>
@import "./BattleArena.css";
</style>

<template>
  <div id="game-battle-arena">
    <img
      id="game-ajime"
      v-if="ajime"
      src="../../../public/images/action-mark.png"
    />
    <h1 v-if="props.character.status === 'win'" class="message">You Won</h1>
    <h1 v-if="props.character.status === 'lose'" class="message">You Lost</h1>
    <div
      id="game-kirby"
      class="character"
      :class="{ selected: kirbyState.selected }"
    >
      <img :src="kirbyState.imgUrl" />
    </div>
    <div
      id="game-knight"
      class="character"
      :class="{ selected: knightState.selected }"
    >
      <img :src="knightState.imgUrl" />
    </div>
  </div>
</template>
