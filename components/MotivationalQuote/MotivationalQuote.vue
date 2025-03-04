<template>
    <div id="motivational-quote">
        <picture>
            <source srcset="@/assets/images/logo.white.png" media="(prefers-color-scheme: dark)">
            <img src="@/assets/images/logo.png" class="logo">
        </picture>
        <div id="quote">
            <div class="body">{{ selectedQuote.quote }}</div>
            <div class="author">{{"-" + selectedQuote.author}}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
interface Quote {
    quote: string;
    author: string;
}
const quotes = [
    {
        "quote": "Champions keep playing until they get it right.",
        "author": "Billie Jean King"
    },
    {
        "quote": "You miss 100% of the shots you don't take.",
        "author": "Wayne Gretzky"
    },
    {
        "quote": "The more difficult the victory, the greater the happiness in winning.",
        "author": "Pelé"
    },
    {
        "quote": "It's not whether you get knocked down, it's whether you get up.",
        "author": "Vince Lombardi"
    },
    {
        "quote": "The only way to prove that you're a good sport is to lose.",
        "author": "Ernie Banks"
    },
    {
        "quote": "If you can believe it, the mind can achieve it.",
        "author": "Ronnie Lott"
    },
    {
        "quote": "It ain't over 'til it's over.",
        "author": "Yogi Berra"
    },
    {
        "quote": "Never say never because limits, like fears, are often just an illusion.",
        "author": "Michael Jordan"
    },
    {
        "quote": "Hard work beats talent when talent doesn't work hard.",
        "author": "Tim Notke"
    },
    {
        "quote": "It's not the will to win that matters—everyone has that. It's the will to prepare to win that matters.",
        "author": "Paul \"Bear\" Bryant"
    },
    {
        "quote": "Winning isn't everything, but wanting to win is.",
        "author": "Vince Lombardi"
    },
    {
        "quote": "You are never really playing an opponent. You are playing yourself, your own highest standards, and when you reach your limits, that is real joy.",
        "author": "Arthur Ashe"
    },
    {
        "quote": "The difference between the impossible and the possible lies in a person's determination.",
        "author": "Tommy Lasorda"
    },
    {
        "quote": "I've failed over and over again in my life. And that is why I succeed.",
        "author": "Michael Jordan"
    },
    {
        "quote": "The only place where success comes before work is in the dictionary.",
        "author": "Vidal Sassoon"
    },
    {
        "quote": "If you train hard, you'll not only be hard, you'll be hard to beat.",
        "author": "Herschel Walker"
    },
    {
        "quote": "Today I will do what others won't, so tomorrow I can accomplish what others can't.",
        "author": "Jerry Rice"
    },
    {
        "quote": "The measure of who we are is what we do with what we have.",
        "author": "Vince Lombardi"
    },
    {
        "quote": "Don't measure yourself by what you have accomplished, but by what you should accomplish with your ability.",
        "author": "John Wooden"
    },
    {
        "quote": "Excellence is not a singular act, but a habit. You are what you repeatedly do.",
        "author": "Shaquille O'Neal"
    }
]

const selectedQuote = ref<Quote>(quotes[Math.floor(Math.random() * quotes.length)]);
</script>

<style scoped>
#motivational-quote {
    display: flex;
    padding: 1rem;
    margin: 0rem 1rem;
    align-items: center;
    border-radius: 0.5rem;
    background-color: var(--secondary-background-color);

    #quote {
        margin: 0rem 1rem;
    }
}

.logo {
    width: 3.5rem;
    height: 3rem;
}

.body {
    font-family: 'Inter';
}

.author {
    font-style: italic;
    color: var(--tertiary-brand-color);
}
</style>