import { renderers, type Renderer } from './renderers'
import { samples } from './samples'
import './style.css'

const $ = <T extends HTMLElement>(selector: string) => document.querySelector<T>(selector)!

const tabs = $('#renderers')
const sampleSelect = $<HTMLSelectElement>('#sample')
const source = $<HTMLTextAreaElement>('#source')
const setup = $('#setup')
const setupToggle = $('#setup-toggle')
const preview = $('#preview')
const html = $('#html')
const status = $('#status')

// The selected library lives in the hash so a link opens the same view
let current: Renderer = renderers.find(r => `#${r.id}` === location.hash) ?? renderers[0]

for (const renderer of renderers) {
  const button = document.createElement('button')
  button.type = 'button'
  button.textContent = renderer.name
  button.dataset.id = renderer.id
  button.addEventListener('click', () => select(renderer))
  tabs.append(button)
}

samples.forEach((sample, index) => sampleSelect.add(new Option(sample.name, String(index))))
sampleSelect.addEventListener('change', () => {
  source.value = samples[Number(sampleSelect.value)].source
  render()
})

setupToggle.addEventListener('click', () => {
  setup.hidden = !setup.hidden
  setupToggle.setAttribute('aria-expanded', String(!setup.hidden))
})

for (const tab of document.querySelectorAll<HTMLButtonElement>('[data-view]')) {
  tab.addEventListener('click', () => {
    for (const other of document.querySelectorAll('[data-view]')) {
      other.setAttribute('aria-selected', String(other === tab))
    }
    preview.hidden = tab.dataset.view !== 'preview'
    html.hidden = tab.dataset.view !== 'html'
  })
}

let pending = 0
source.addEventListener('input', () => {
  cancelAnimationFrame(pending)
  pending = requestAnimationFrame(render)
})

// Keep Tab inside the editor instead of moving focus
source.addEventListener('keydown', event => {
  if (event.key !== 'Tab' || event.shiftKey) return
  event.preventDefault()
  source.setRangeText('  ', source.selectionStart, source.selectionEnd, 'end')
  render()
})

function select(renderer: Renderer) {
  current = renderer
  history.replaceState(null, '', `#${renderer.id}`)
  for (const button of tabs.querySelectorAll<HTMLButtonElement>('button')) {
    button.setAttribute('aria-selected', String(button.dataset.id === renderer.id))
  }
  setup.firstElementChild!.textContent = renderer.setup
  render()
}

function render() {
  const start = performance.now()
  try {
    const output = current.render(source.value)
    const elapsed = performance.now() - start
    preview.innerHTML = output
    html.firstElementChild!.textContent = output
    status.textContent = `${current.name} · ${elapsed.toFixed(1)} ms`
    status.classList.remove('error')
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : String(error)
    status.classList.add('error')
  }
}

source.value = samples[0].source
select(current)
