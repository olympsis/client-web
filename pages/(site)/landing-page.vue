<template>
	<TopBar/>
	<main id="landing">
		<!-- Hero Section — Basketball Background
			 "How It Works" panel sits at the bottom of the hero,
			 overlaying the basketball image with a glass blur effect. -->
		<section class="hero">
			<div class="hero-content">
				<h1 class="hero-title">
					<em>Find</em> your<br/>
					<em class="accent-red">Game.</em>
				</h1>
				<div class="hero-actions">
					<NuxtLink to="/events" class="btn-explore">Explore Events</NuxtLink>
					<NuxtLink to="/events/new" class="btn-host">Host an event</NuxtLink>
				</div>
			</div>

			<!-- Glass panel pinned to the bottom of the basketball image -->
			<div class="how-it-works glass">
				<div class="section-container">
					<p class="label-gold">HOW IT WORKS</p>
					<h2 class="heading-white">Three steps to<br/>game time.</h2>
					<div class="steps-row">
						<div class="step-col">
							<p class="step-num">01</p>
							<h3 class="step-title">Browse Events</h3>
							<p class="step-body">Search by sport, location, or date. Filter for skill level, see what's live right now, and find exactly what you're looking for.</p>
						</div>
						<div class="step-col">
							<p class="step-num">02</p>
							<h3 class="step-title">RSVP &amp; show up</h3>
							<p class="step-body">Tap to join an event, add it to your calendar, get directions. Hosts see who's coming so the vibe is always right.</p>
						</div>
						<div class="step-col">
							<p class="step-num">03</p>
							<h3 class="step-title">Play &amp; repeat</h3>
							<p class="step-body">After the game, follow the host, save the location, come back next week. Build your roster of go-to events.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- Why Olympsis Section — Soccer Background
			 Glass panel at the bottom with heading + feature grid,
			 same pattern as the How It Works panel above. -->
		<section class="why-olympsis">
			<div class="why-olympsis-spacer"></div>
			<div class="why-panel glass">
				<div class="section-container">
					<p class="label-gold">WHY OLYMPSIS</p>
					<h2 class="heading-white heading-italic">Built for people<br/>who show up.</h2>
					<div class="features-row">
						<div class="feature-col">
							<h3 class="feature-title">Discover Nearby</h3>
							<p class="feature-body">Find pickup games, leagues, and community runs happening right around the corner — updated in real time.</p>
						</div>
						<div class="feature-col">
							<h3 class="feature-title">Host in Seconds</h3>
							<p class="feature-body">Create an event, pick a park, set a time. Share the link and watch your squad come together. No extra apps required.</p>
						</div>
						<div class="feature-col">
							<h3 class="feature-title">Build a Community</h3>
							<p class="feature-body">Follow hosts, RSVP to recurring runs, and find your regular crew. Sports are better with people who keep showing up.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<!-- CTA Section — Pickleball Background -->
		<section class="cta">
			<div class="cta-content">
				<h2 class="cta-heading">
					Stop <em>scrolling.</em><br/>
					Start <em class="accent-red">playing.</em>
				</h2>
				<p class="cta-body">Join thousands of players finding their next game on Olympsis. Available in NY area &amp; Utah — more locations coming soon.</p>
				<NuxtLink to="/signin" class="btn-cta">Join our Community</NuxtLink>
			</div>
		</section>
	</main>
	<BottomBar/>
</template>

<script setup lang="ts">
import TopBar from '~/components/site/TopBar/TopBar.vue';
import BottomBar from '~/components/site/BottomBar/BottomBar.vue';

useSeoMeta({
	title: 'Olympsis — Find Your Game',
	ogTitle: 'Olympsis — Find Your Game',
	description: 'Find pickup games, leagues, and sports events near you. RSVP in seconds and start playing.',
	ogDescription: 'Find pickup games, leagues, and sports events near you. RSVP in seconds and start playing.',
});
</script>

<style scoped>
@import '@/assets/css/main.css';

/* =============================================
   Landing Page Layout
   ============================================= */

#landing {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	width: 100%;
}

/* Constrained content wrapper used inside full-bleed sections */
.section-container {
	width: 100%;
	max-width: var(--desktop-max-width);
	margin: 0 auto;
	padding: 0 2rem;
}

/* =============================================
   Shared Typography
   ============================================= */

/* Gold uppercase label used for section subtitles (e.g. "HOW IT WORKS") */
.label-gold {
	color: var(--tertiary-brand-color);
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-size: 0.8rem;
	font-weight: 700;
	letter-spacing: 0.15em;
	text-transform: uppercase;
	margin: 0 0 0.5rem;
}

/* Large white section heading — Archivo Black */
.heading-white {
	color: white;
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-weight: 900;
	font-size: 2.5rem;
	line-height: 1.1;
	margin: 0;
}

.heading-italic {
	font-style: italic;
}

/* Red accent color used on "Game." and "playing." */
.accent-red {
	color: var(--secondary-brand-color);
}

/* =============================================
   Hero Section — Basketball Background
   ============================================= */

.hero {
	position: relative;
	display: flex;
	flex-direction: column;
	background-image: url('@/assets/images/basketball.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;

	/* Dark gradient overlay so white text is readable over the photo */
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0.20) 0%,
			rgba(0, 0, 0, 0.50) 100%
		);
		z-index: 0;
	}
}

/* Takes up remaining space and vertically centers the title + buttons */
.hero-content {
	position: relative;
	z-index: 1;
	flex-grow: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	text-align: center;
	min-height: 70vh;
}

.hero-title {
	color: white;
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-weight: 900;
	font-style: italic;
	font-size: 4rem;
	line-height: 1.05;
	margin: 0 0 2rem;
}

.hero-actions {
	display: flex;
	gap: 1rem;
	justify-content: center;
	flex-wrap: wrap;
}

.btn-explore {
	color: white;
	font-weight: 700;
	font-size: 0.9rem;
	font-style: italic;
	padding: 0.7rem 1.6rem;
	border-radius: 20px;
	font-family: 'Archivo', sans-serif;
	cursor: pointer;
	transition: transform 0.15s;

	/* Glass effect from event [id].vue modals — keeps the red tint */
	background: rgba(195, 43, 66, 0.65);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: var(--component-border-color) solid 1px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

	&:hover { transform: scale(1.05); }
}

.btn-host {
	color: white;
	font-weight: 700;
	font-size: 0.9rem;
	font-style: italic;
	padding: 0.7rem 1.6rem;
	border-radius: 20px;
	font-family: 'Archivo', sans-serif;
	cursor: pointer;
	transition: transform 0.15s;

	/* Glass effect — translucent white tint */
	background: rgba(255, 255, 255, 0.12);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: var(--component-border-color) solid 1px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

	&:hover { transform: scale(1.05); }
}

/* =============================================
   How It Works — Glass panel at bottom of hero
   ============================================= */

/* Sits at the bottom of the hero flex column.
   .glass class from main.css provides the backdrop blur. */
.how-it-works {
	position: relative;
	z-index: 1;
	width: 100%;
	padding: 3rem 0;
}

.how-it-works .heading-white {
	margin-bottom: 3rem;
}

.steps-row {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2rem;
}

.step-num {
	color: var(--tertiary-brand-color);
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-weight: 900;
	font-size: 2.5rem;
	margin: 0 0 0.25rem;
}

.step-title {
	color: white;
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-weight: 700;
	font-size: 1rem;
	margin: 0 0 0.5rem;
}

.step-body {
	color: rgba(255, 255, 255, 0.80);
	font-size: 0.85rem;
	line-height: 1.55;
	margin: 0;
}

/* =============================================
   Why Olympsis Section — Soccer Background + Glass
   Same pattern as the hero: image bg, glass panel at bottom
   ============================================= */

.why-olympsis {
	display: flex;
	flex-direction: column;
	background-image: url('@/assets/images/soccer.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
}

/* Pushes the glass panel to the bottom, exposing the soccer image above */
.why-olympsis-spacer {
	min-height: 40vh;
}

/* Glass panel pinned at the bottom of the soccer image */
.why-panel {
	position: relative;
	z-index: 1;
	width: 100%;
	padding: 3rem 0;
}

.why-panel .heading-white {
	margin-bottom: 2.5rem;
}

.features-row {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 2rem;
}

.feature-title {
	color: white;
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-weight: 700;
	font-size: 1.05rem;
	margin: 0 0 0.5rem;
}

.feature-body {
	color: rgba(255, 255, 255, 0.80);
	font-size: 0.85rem;
	line-height: 1.55;
	margin: 0;
}

/* =============================================
   CTA Section — Pickleball Background
   ============================================= */

.cta {
	position: relative;
	min-height: 70vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background-image: url('@/assets/images/pickleball.jpg');
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;

	/* Dark overlay for contrast */
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		background: rgba(0, 0, 0, 0.55);
	}
}

.cta-content {
	position: relative;
	z-index: 1;
	text-align: center;
	max-width: 34rem;
	padding: 2rem;
}

.cta-heading {
	color: white;
	font-family: 'Archivo', 'Helvetica Nue', 'Roboto';
	font-weight: 900;
	font-size: 3.5rem;
	line-height: 1.1;
	margin: 0 0 1.5rem;

	/* "Stop" and "Start" are upright, "scrolling." and "playing." are italic */
	em {
		font-style: italic;
	}
}

.cta-body {
	color: rgba(255, 255, 255, 0.9);
	font-size: 1rem;
	line-height: 1.6;
	margin: 0 0 2rem;
}

.btn-cta {
	display: inline-block;
	color: white;
	font-weight: 700;
	font-style: italic;
	font-size: 0.9rem;
	padding: 0.75rem 2rem;
	border-radius: 25px;
	font-family: 'Archivo', sans-serif;
	cursor: pointer;
	transition: transform 0.15s;

	/* Glass effect — keeps the red tint */
	background: rgba(195, 43, 66, 0.65);
	backdrop-filter: blur(20px);
	-webkit-backdrop-filter: blur(20px);
	border: var(--component-border-color) solid 1px;
	box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;

	&:hover { transform: scale(1.05); }
}

/* =============================================
   Responsive — Tablet
   ============================================= */

@media screen and (max-width: 768px) {
	.hero-title {
		font-size: 3rem;
	}

	.heading-white {
		font-size: 2rem;
	}

	.steps-row {
		grid-template-columns: 1fr;
		gap: 2.5rem;
	}

	.features-row {
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	.cta-heading {
		font-size: 2.5rem;
	}
}

/* =============================================
   Responsive — Mobile
   ============================================= */

@media screen and (max-width: 599px) {
	.section-container {
		padding: 0 1.25rem;
	}

	.hero {
		min-height: 70vh;
	}

	.hero-title {
		font-size: 2.5rem;
	}

	.why-olympsis-spacer {
		min-height: 25vh;
	}

	.cta {
		min-height: 60vh;
	}

	.cta-heading {
		font-size: 2rem;
	}

	.btn-explore,
	.btn-host {
		padding: 0.6rem 1.2rem;
		font-size: 0.85rem;
	}
}
</style>
