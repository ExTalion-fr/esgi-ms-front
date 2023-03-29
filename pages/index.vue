<template>
	<div class="index">
		<TheHeader style="position: relative"/>
		<div id="content">
			<div id="text">
				<h1>Mes Citations</h1>
				<h1>Mes <span>Envies</span></h1>
				<p>Bienvenue sur notre site de citations inspirantes ! Nous sommes une plateforme dédiée à rassembler les mots les plus inspirants et motivants jamais prononcés. Notre collection de citations est soigneusement sélectionnée pour vous apporter une dose quotidienne d'inspiration, de positivité et de motivation.</p>
				<button><NuxtLink :to="`/pages/pins`">Explorer les citations<i class="fas fa-chevron-down"></i></NuxtLink></button>
			</div>
		</div>
	</div>
</template>

<style scoped>

	.index {
		height: 100vh;
		background-image: url("../assets/img/background_index.jpg");
		background-position: center;
		background-size: cover;
	}

	header {
		box-shadow: none;
		background-color: transparent;
	}

</style>
