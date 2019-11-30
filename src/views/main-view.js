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
            header
            {
                display: flex;
                flex-direction: column;
                align-items: center;
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
            <header>
                <h1>Harikrishnan Balagopal</h1>
                <h2>M.Tech. CSE IIT Kanpur</h2>
            </header>
            <section>
                <h2>About Me</h2>
                <p>
                    I am a M.Tech. student in Computer Science and Engineering Department, IIT Kanpur. I am from Kerala, India. I joined IITK in 2018.
                    My interests include Deep Learning, Computer Vision and Computer Graphics. Currently researching ways to generate videos using GANS.
                    Interested in security research and formal verfication as a hobby.
                </p>
                <h2>About This Website</h2>
                <p>
                    This is my personal website. I have included links to my codepen and some awesome <span class="highlight">❤</span> stuff (mostly related to javascript) below.
                    I have always been interested in Science and Technology, especially Computer Science and Physics, so I created this website to share some of the stuff I have found interesting over the years.
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
                <h2>Some of my shadertoy shaders</h2>
                <p>To avoid overloading your device the shaders are paused. Hover over them to show the controls and click play to see them in action. Some of them are also interactive.</p>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/3d3XRf?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/wd3XzS?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/3dVSzR?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
                <iframe width="640" height="360" frameborder="0" src="https://www.shadertoy.com/embed/wdyXDV?gui=true&t=10&paused=true&muted=false" allowfullscreen></iframe>
            </section>
            <section>
                <h2>Indian Railways delay visualization</h2>
                <p>Visualization created as part of main project for CS685 Data Mining course at IIT Kanpur. <a href="https://github.com/HarikrishnanBalagopalIITK/IndianRailwaysDelayMap" target="_blank">Github repo.</a></p>
                <iframe width="640" height="640" frameborder="0" src="https://harikrishnanbalagopaliitk.github.io/IndianRailwaysDelayMap/" allowfullscreen></iframe>
            </section>
            <section>
                <h2>Waves</h2>
                <p>
                    This is a web component I made using LitElement and WebGL 2. It is available on NPM: <a href="https://www.npmjs.com/package/@haribala/waves-element" target="_blank">@haribala/waves-element</a>. Click and drag to create ripples in the pond.
                </p>
                <waves-element></waves-element>
            </section>
            <section>
                <h2>Some of my more interesting repos</h2>
                <p>
                    <a target="_blank" href="https://github.com/HarikrishnanBalagopal/gdb-gui">GDB GUI</a>
                    A graphical user interface to interact with the GNU Debugger (GDB). Includes a console pass-through so you can pass more complicated commands directly to GDB. Written in <a target="_blank" href="https://elm-lang.org/">ELM</a>.
                    Originally built because I was developing exploits in games and got tired of the severe lack of user friendliness of GDB's console interface.
                </p>
                <p>
                    <a target="_blank" href="https://github.com/HarikrishnanBalagopal/parser-generator">Parse Generator Library</a>
                    A CLR(1) parser generator for Javascript. Lexer not included. Built because I wanted to automatically generate compilers for programming language grammers specified in Backus–Naur form.
                </p>
                <p>
                    <a target="_blank" href="https://github.com/HarikrishnanBalagopal/chrome-audio-visualizer">Chrome Audio Visualizer</a>
                    A audio visualizer extension for chrome. Made specifically for Youtube.
                </p>
                <p>
                    <a target="_blank" href="https://github.com/HarikrishnanBalagopal/HarikrishnanBalagopal.github.io">Old website</a>
                    My old website built using React.
                </p>
                <p>
                    <a target="_blank" href="https://harikrishnanbalagopal.github.io/s2_symbolic_fuzzing.pdf">Research slides</a>
                    Research on Symbolic Execution to automatically perform formal verfication of programs.
                </p>
            </section>
            <footer>
                <h2>Awesome Stuff <span class="highlight">❤</span></h2>
                <ul>
                    <li><a target="_blank" href="https://codepen.io/collection/AMvJZW/">Some of my better codepens.</a></li>
                    <li><a target="_blank" href="http://madebyevan.com/webgl-path-tracing/">WebGL Path Tracing</a></li>
                    <li><a target="_blank" href="http://aem1k.com/">Javascript Hacks and Creative Coding</a></li>
                    <li><a target="_blank" href="http://aem1k.com/world/">Spinning Globe Quine</a></li>
                    <li><a target="_blank" href="https://www.shadertoy.com/view/ldlSzX">Synthetic Aperture shader</a></li>
                    <li><a target="_blank" href="https://youtu.be/n0kn4mDXY6I">First fully automated DEFCON CTF held by DARPA</a></li>
                    <li><a target="_blank" href="https://youtu.be/RTxtiLp1C8Y">Martin Kleppe: 1024+ Seconds of JS Wizardry -- JSConf EU 2013</a></li>
                </ul>
            </footer>
        </div>
        `;
    }
}

customElements.define('main-view', MainView);