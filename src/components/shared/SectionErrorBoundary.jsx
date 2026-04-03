import { Component } from 'react'

/**
 * Class-based error boundary that wraps individual section renderers.
 * Shows a dev-friendly fallback instead of crashing the entire canvas.
 *
 * Props:
 *   type: string — the section type key (e.g. "navbar"), shown in the fallback.
 */
export default class SectionErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error(`[SectionErrorBoundary] Section "${this.props.type}" crashed:`, error, info)
  }

  render() {
    if (this.state.error) {
      const { type } = this.props
      return (
        <div style={{
          padding:    '16px 20px',
          background: '#fee2e2',
          border:     '1px solid #fca5a5',
          color:      '#991b1b',
          fontFamily: 'monospace',
          fontSize:   '13px',
          lineHeight: '1.5',
        }}>
          <strong>Section error{type ? ` — "${type}"` : ''}</strong>
          <br />
          {this.state.error.message}
        </div>
      )
    }
    return this.props.children
  }
}
