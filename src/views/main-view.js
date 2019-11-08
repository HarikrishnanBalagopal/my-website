import {LitElement, html, css} from 'lit-element';
import '@haribala/waves-element';

class MainView extends LitElement
{
    static get styles()
    {
        return css`
            :host
            {
                --charcoal: #2d3033;
                --color-gold: #fcbb34;
                --color-cyan: rgb(0, 180, 240);
                --color-darker-cyan: rgb(0, 140, 200);

                --back-color: var(--charcoal);
                --text-color: white;
                --highlight-color: var(--color-gold);

                display: grid;
                height: 100%;
                font-size: 16px;
            }
            .wrapper
            {
                padding: 1em;
                background-color: var(--back-color);
                color: var(--text-color);
                font-family: 'Montserrat', sans-serif;
            }
            h1
            {
                margin: 0;
                font-size: 2.75em;
                line-height: 1.5;
                letter-spacing: 0em;
                font-weight: 400;
            }
            a
            {
                text-decoration: none;
                color: var(--color-cyan);
            }
            a:hover
            {
                color: var(--color-darker-cyan);
            }
            .highlight
            {
                color: transparent;
                text-shadow: 0 0 0 var(--highlight-color);
            }
        `;
    }
    render()
    {
        return html`
        <div class="wrapper">
            <h1>About Me</h1>
            <section>
                <h2>Harikrishnan Balagopal</h2>
                <p>
                    This is my personal website. I have included links to my codepen and some awesome <span class="highlight">❤</span> stuff (mostly related to javascript) below.
                    Enthusiastic about science and technology in general and especially about computers and physics.
                    Researching ways to generate videos using GANS. Interested in security research and formal verfication as a hobby.
                </p>
            </section>
            <section>
                <h2>Favourite languages</h2>
                <ul>
                    <li>Python</li>
                    <li>Javascript/Typescript</li>
                    <li>Haskell</li>
                    <li>Rust</li>
                    <li>Go</li>
                    <li>C/C++</li>
                </ul>
            </section>
            <section>
                <h2>Waves</h2>
                <p>
                    This is a web component I made using LitElement and WebGL 2. It is available on NPM: <a href="https://www.npmjs.com/package/@haribala/waves-element" target="_blank">@haribala/waves-element</a>. Click and drag to create ripples in the pond.
                </p>
                <waves-element></waves-element>
            </section>
            <section>
                <h2>Some of my shadertoy shaders</h2>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/3d3XRf?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/wd3XzS?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/3dVSzR?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
            </section>
            <section>
                <h2>Awesome Stuff <span class="highlight">❤</span></h2>
                <ul>
                    <li><a target="_blank" href="https://codepen.io/collection/AMvJZW/">Some of my better codepens.</a></li>
                    <li><a target="_blank" href="http://madebyevan.com/webgl-path-tracing/">WebGL Path Tracing</a></li>
                    <li><a target="_blank" href="http://aem1k.com/">Javascript Hacks and Creative Coding</a></li>
                    <li><a target="_blank" href="http://aem1k.com/world/">Spinning Globe Quine</a></li>
                    <li><a target="_blank" href="https://www.shadertoy.com/view/ldlSzX">Synthetic Aperture shader</a></li>
                    <li><a target="_blank" href="https://youtu.be/RTxtiLp1C8Y">Martin Kleppe: 1024+ Seconds of JS Wizardry -- JSConf EU 2013</a></li>
                </ul>
            </section>
        </div>
        `;
    }
}

customElements.define('main-view', MainView);