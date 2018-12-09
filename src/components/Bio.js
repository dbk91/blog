import React from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import { rhythm } from '../utils/typography'

class Bio extends React.Component {
  render() {
    return (
      <div
        style={{
          display: 'flex',
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src="https://avatars0.githubusercontent.com/u/7128101?s=460&v=4"
          alt={`Dan Kelly`}
          style={{
            marginRight: rhythm(1 / 2),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%',
          }}
        />
        <p>
          <strong>
            <a
              href="https://github.com/dbk91"
              target="_blank"
              rel="noopener norreferrer"
            >
              Dan Kelly
            </a>
          </strong>
          's personal blog. Musings about React and other fun technology.
        </p>
      </div>
    )
  }
}

export default Bio
