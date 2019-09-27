import {LitElement, html, css} from 'lit-element';

class MainView extends LitElement
{
    static get styles()
    {
        return css`
            :host
            {
                --charcoal: #2d3033;
                --color-gold: #fcbb34;

                --back-color: var(--charcoal);
                --text-color: white;
                --highlight-color: var(--color-gold);

                font-size: 16px;
            }
            .wrapper
            {
                padding: 1em;
                background-color: var(--back-color);
                color: var(--text-color);
                font-family: 'Montserrat', sans-serif;
                height: 100%;
            }
            h1
            {
                margin: 0;
                font-size: 2.75em;
                line-height: 1.5;
                letter-spacing: 0em;
                font-weight: 400;
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
            <h2>Harikrishnan Balagopal</h2>
            <p>
                This is my personal website. I have included links to my codepen and some awesome <span class="highlight">❤</span> stuff (mostly related to javascript) below.
                Ok so finally we are up and running.
            </p>
        </div>
        `;
    }
}

customElements.define('main-view', MainView);