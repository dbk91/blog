import Typography from 'typography'
import Wordpress2016 from 'typography-theme-wordpress-2016'

Wordpress2016.overrideThemeStyles = () => ({
  'a.gatsby-resp-image-link': {
    boxShadow: 'none',
  },
  a: {
    color: '#FFCC66',
  },
  body: {
    backgroundColor: 'hsl(222, 22%, 22%)',
    color: 'white',
  },
  pre: {
    borderRadius: '10px',
    backgroundColor: 'hsl(222, 22%, 15%)',
    padding: '10px',
    boxShadow: '0px 2px 2px hsl(0, 0%, 10%)',
    overflowX: 'auto',
  },
  'pre,code': {
    lineHeight: '20px',
    fontFamily: [
      '"Source Code Pro"',
      'Menlo',
      'Monaco',
      'Consolas',
      '"Courier New"',
      'monospace',
    ].join(','),
  },
  'pre.language-js code span.token.tag,pre.language-jsx code span.token.tag': {
    color: '#5CCFE6',
  },
  'pre.language-js code span.token.function,pre.language-jsx code span.token.function': {
    color: '#FFD580',
  },
  'pre.language-js code span.token.string,pre.language-jsx code span.token.string': {
    color: '#BAE67E',
  },
  'pre.language-js code span.token.keyword,pre.language-jsx code span.token.keyword': {
    color: '#FFA759',
  },
  'pre.language-js code span.token.comment,pre.language-jsx code span.token.comment': {
    color: '#5C6773',
  },
  'pre.language-js code span.token.operator,pre.language-jsx code span.token.operator': {
    color: '#F29E74',
  },
  'pre.language-js code span.token.number,pre.language-jsx code span.token.number': {
    color: '#FFCC66',
  },
  [`pre.language-js code span.token.punctuation,
  pre.language-jsx code span.token.punctuation,
  span.script.language-javascript`]: {
    color: '#FFFFFF',
  },
  'pre.language-js code span.token.attr-name,pre.language-jsx code span.token.attr-name': {
    color: '#FFE6B3',
  },
})

delete Wordpress2016.googleFonts

const typography = new Typography(Wordpress2016)

// Hot reload typography in development.
if (process.env.NODE_ENV !== 'production') {
  typography.injectStyles()
}

export default typography
export const rhythm = typography.rhythm
export const scale = typography.scale
