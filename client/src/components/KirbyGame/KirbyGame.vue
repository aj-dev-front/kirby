<script setup>
import Lobby from "@/components/GameLobby/GameLobby.vue";
import Arena from "@/components/BattleArena/BattleArena.vue";
import { useSocket } from "@/services/socket";

import { ref, watch } from "vue";

const isConnected = ref(false);
const gameIsReady = ref(true);

const { networkStatus, socket, character, ajime } = useSocket();

watch(networkStatus, (status) => {
  gameIsReady.value = status === "ready";
  isConnected.value = status !== "disconnected";
});

function joinGame() {
  socket.connect();
}

function touched() {
  socket.emit("strike");
}
</script>

<style scoped>
@import "./KirbyGame.css";
</style>

<template>
  <div id="render-game">
    <img id="background" src="@/../public/images/background.png" />

    <div id="game" @click="touched">
      <template v-if="isConnected">
        <component
          :is="gameIsReady ? Arena : Lobby"
          :character="character"
          :ajime="ajime"
        ></component>
      </template>
      <template v-else>
        <button id="game-join" @click.stop="joinGame">Rejoindre</button>
      </template>
    </div>
  </div>
</template>
