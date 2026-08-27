function AnalyticsPanel({
  analytics,
  loading,
  handleBack,
}) {
  if (loading) {
    return (
      <section>
        <button
          type="button"
          onClick={handleBack}
        >
          Back to Handovers
        </button>

        <h2>Handover Analytics</h2>

        <p>Loading analytics...</p>
      </section>
    )
  }

  if (!analytics) {
    return (
      <section>
        <button
          type="button"
          onClick={handleBack}
        >
          Back to Handovers
        </button>

        <h2>Handover Analytics</h2>

        <p>Analytics are unavailable.</p>
      </section>
    )
  }

  return (
    <section className="analytics-panel">
      <div className="analytics-header">
        <div>
          <button
            type="button"
            onClick={handleBack}
          >
            Back to Handovers
          </button>

          <h2>Handover Analytics</h2>
        </div>
      </div>

      <div className="analytics-summary">
        <article>
          <span className="analytics-value">
            {analytics.handovers.total}
          </span>

          <span>Total Handovers</span>
        </article>

        <article>
          <span className="analytics-value">
            {analytics.handovers.open}
          </span>

          <span>Open</span>
        </article>

        <article>
          <span className="analytics-value">
            {analytics.handovers.in_progress}
          </span>

          <span>In Progress</span>
        </article>

        <article>
          <span className="analytics-value">
            {analytics.handovers.closed}
          </span>

          <span>Closed</span>
        </article>

        <article>
          <span className="analytics-value">
            {analytics.updates}
          </span>

          <span>Updates</span>
        </article>

        <article>
          <span className="analytics-value">
            {analytics.acknowledgments}
          </span>

          <span>Acknowledgments</span>
        </article>
      </div>

      <div className="analytics-breakdowns">
        <article>
          <h3>Priority</h3>

          <p>
            <strong>High:</strong>{' '}
            {analytics.priority.high}
          </p>

          <p>
            <strong>Normal:</strong>{' '}
            {analytics.priority.normal}
          </p>

          <p>
            <strong>Low:</strong>{' '}
            {analytics.priority.low}
          </p>
        </article>

        <article>
          <h3>Categories</h3>

          {Object.entries(
            analytics.categories
          ).map(([category, count]) => (
            <p key={category}>
              <strong>
                {category.replaceAll('_', ' ')}:
              </strong>{' '}
              {count}
            </p>
          ))}
        </article>
      </div>
    </section>
  )
}

export default AnalyticsPanel