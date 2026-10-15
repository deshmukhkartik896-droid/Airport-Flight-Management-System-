import { SYLLABUS_COVERAGE } from '../../config/syllabus'

export function SyllabusPage() {
  return (
    <div>
      <div className="page-header">
        <h2>Syllabus Coverage</h2>
        <p>
          Mapping of course units to working implementations. Units IV and V are provisional until checked against the
          official syllabus — edit <code>src/config/syllabus.ts</code> without rewriting the app.
        </p>
      </div>
      <div className="card">
        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Unit</th>
                <th>Concept</th>
                <th>DSA implementation</th>
                <th>Application feature</th>
                <th>Demonstration location</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {SYLLABUS_COVERAGE.map((row) => (
                <tr key={row.id}>
                  <td>{row.unit}{row.provisional ? '*' : ''}</td>
                  <td>{row.concept}</td>
                  <td>{row.dsaImplementation}</td>
                  <td>{row.applicationFeature}</td>
                  <td>{row.demonstrationLocation}</td>
                  <td>
                    <span className="badge st-Arrived">{row.status}</span>
                    {row.provisional ? ' provisional' : ''}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="note" style={{ marginTop: 12 }}>
        * Provisional Unit IV / V mapping. Confirm with the instructor before the viva.
      </p>
    </div>
  )
}
