// Runtime utility to convert a small, project-specific subset of Tailwind utility classes
// into inline styles to allow removing Tailwind dependency without rewriting every page.

type StyleMap = { [k: string]: string }

const singleTokenMap: Record<string, StyleMap> = {
  'min-h-screen': { minHeight: '100vh' },
  'flex': { display: 'flex' },
  'items-center': { alignItems: 'center' },
  'justify-center': { justifyContent: 'center' },
  'bg-white': { backgroundColor: '#ffffff' },
  'bg-gray-50': { backgroundColor: '#f9fafb' },
  'bg-yellow-100': { backgroundColor: '#fef3c7' },
  'bg-green-100': { backgroundColor: '#d1fae5' },
  'rounded-lg': { borderRadius: '8px' },
  'shadow-lg': { boxShadow: '0 10px 20px rgba(2,6,23,0.08)' },
  'shadow': { boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  'w-full': { width: '100%' },
  'text-white': { color: '#fff' },
  'text-center': { textAlign: 'center' },
  'font-bold': { fontWeight: '700' },
  'space-y-4': { gap: '1rem', display: 'flex', flexDirection: 'column' },
}

const sizeMap = {
  'p-8': { padding: '2rem' },
  'p-6': { padding: '1.25rem' },
  'p-4': { padding: '1rem' },
  'px-4': { paddingLeft: '1rem', paddingRight: '1rem' },
  'py-2': { paddingTop: '0.5rem', paddingBottom: '0.5rem' },
}

// Colors used across pages; map token to hex approximations
const colorMap: Record<string, string> = {
  'indigo-600': '#4f46e5',
  'indigo-700': '#4338ca',
  'blue-600': '#2563eb',
  'green-600': '#16a34a',
  'green-700': '#15803d',
  'gray-600': '#4b5563',
  'gray-900': '#111827',
  'orange-400': '#fb923c',
  'blue-400': '#60a5fa',
}

// Patterns (combinations) to match specific complex utilities used in this project
const patternMaps: Array<{ tokens: string[]; style: StyleMap }> = [
  {
    tokens: ['bg-gradient-to-br', 'from-blue-50', 'to-indigo-100'],
    style: { background: 'linear-gradient(135deg,#eff6ff 0%,#eef2ff 100%)' },
  },
  {
    tokens: ['bg-gradient-to-br', 'from-green-50', 'to-emerald-100'],
    style: { background: 'linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)' },
  },
  {
    tokens: ['max-w-7xl'],
    style: { maxWidth: '1120px', marginLeft: 'auto', marginRight: 'auto' },
  },
  { tokens: ['max-w-md'], style: { maxWidth: '420px' } },
  { tokens: ['text-3xl'], style: { fontSize: '1.75rem', lineHeight: '1.2' } },
  { tokens: ['text-5xl'], style: { fontSize: '3rem', lineHeight: '1.1' } },
  { tokens: ['text-2xl'], style: { fontSize: '1.5rem' } },
  { tokens: ['text-lg'], style: { fontSize: '1.125rem' } },
]

function applyStyleMap(el: HTMLElement, map: StyleMap) {
  for (const k in map) {
    // @ts-ignore
    el.style[k as any] = map[k]
  }
}

export function applyTwReplacement() {
  if (typeof document === 'undefined') return

  const all = Array.from(document.querySelectorAll<HTMLElement>('*'))

  for (const el of all) {
    const classAttr = el.className
    if (!classAttr) continue
    const tokens = String(classAttr).split(/\s+/).filter(Boolean)
    if (tokens.length === 0) continue

    // Apply pattern maps first
    for (const pat of patternMaps) {
      if (pat.tokens.every((t) => tokens.includes(t))) {
        applyStyleMap(el, pat.style)
      }
    }

    // Apply single token maps
    for (const t of tokens) {
      if (singleTokenMap[t]) applyStyleMap(el, singleTokenMap[t])
      if (sizeMap[t]) applyStyleMap(el, sizeMap[t])

      // color tokens like text-indigo-600, bg-green-600
      if (t.startsWith('text-')) {
        const colorKey = t.replace('text-', '')
        if (colorMap[colorKey]) el.style.color = colorMap[colorKey]
      }
      if (t.startsWith('bg-')) {
        const colorKey = t.replace('bg-', '')
        if (colorMap[colorKey]) el.style.backgroundColor = colorMap[colorKey]
      }
      if (t === 'px-4' && el.style.paddingLeft === '') {
        el.style.paddingLeft = '1rem'
        el.style.paddingRight = '1rem'
      }
    }

    // For buttons with hover classes like hover:bg-indigo-700 we cannot replicate hover easily inline.
    // We'll add a simple mouseenter/mouseleave listener that toggles background if hover token exists.
    const hoverBg = tokens.find((tk) => tk.startsWith('hover:bg-'))
    if (hoverBg) {
      const colorKey = hoverBg.replace('hover:bg-', '')
      const hoverColor = colorMap[colorKey]
      if (hoverColor) {
        const original = el.style.backgroundColor
        el.addEventListener('mouseenter', () => { el.style.backgroundColor = hoverColor })
        el.addEventListener('mouseleave', () => { el.style.backgroundColor = original })
      }
    }
  }
}
