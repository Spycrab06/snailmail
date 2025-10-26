import { useState } from 'react';
import './SQLQueryPage.css';
import { API_URL } from '../config/api';

const SQLQueryPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);

  // Sample queries for quick access
  const sampleQueries = [
    { name: 'Show All Tables', query: 'SHOW TABLES' },
    { name: 'All Users', query: 'SELECT * FROM authentication' },
    { name: 'All Customers', query: 'SELECT * FROM customer' },
    { name: 'All Employees', query: 'SELECT * FROM employee' },
    { name: 'Customers with Addresses', query: `SELECT c.first_name, c.last_name, c.account_type, a.street_name, a.city_name, a.state_name
FROM customer c
JOIN address a ON c.address_id = a.address_id` },
    { name: 'Count Records', query: `SELECT
  (SELECT COUNT(*) FROM authentication) as total_users,
  (SELECT COUNT(*) FROM customer) as total_customers,
  (SELECT COUNT(*) FROM employee) as total_employees` }
  ];

  const handleExecuteQuery = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResults(null);
    setExecutionTime(null);

    const startTime = Date.now();

    try {
      const response = await fetch(`${API_URL}/executeQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });

      const data = await response.json();
      const endTime = Date.now();
      setExecutionTime(endTime - startTime);

      if (data.success) {
        setResults(data.results);
      } else {
        setError(data.error || 'Query failed');
      }
    } catch (err) {
      setError('Failed to execute query: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadSampleQuery = (sampleQuery) => {
    setQuery(sampleQuery);
    setResults(null);
    setError(null);
  };

  const clearQuery = () => {
    setQuery('');
    setResults(null);
    setError(null);
    setExecutionTime(null);
  };

  const renderResults = () => {
    if (!results) return null;

    if (Array.isArray(results) && results.length === 0) {
      return <div className="no-results">No results returned</div>;
    }

    if (Array.isArray(results) && results.length > 0) {
      const columns = Object.keys(results[0]);

      return (
        <div className="results-container">
          <div className="results-header">
            <span>📊 {results.length} row(s) returned</span>
            {executionTime && <span>⏱️ {executionTime}ms</span>}
          </div>
          <div className="table-wrapper">
            <table className="results-table">
              <thead>
                <tr>
                  <th>#</th>
                  {columns.map(col => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {results.map((row, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    {columns.map(col => (
                      <td key={col}>
                        {row[col] === null ? <span className="null-value">NULL</span> : String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // For non-SELECT queries (INSERT, UPDATE, DELETE, etc.)
    if (results.affectedRows !== undefined) {
      return (
        <div className="query-info">
          <h3>✅ Query Executed Successfully</h3>
          <p>Affected rows: {results.affectedRows}</p>
          {results.insertId && <p>Insert ID: {results.insertId}</p>}
          {results.changedRows !== undefined && <p>Changed rows: {results.changedRows}</p>}
          {executionTime && <p>Execution time: {executionTime}ms</p>}
        </div>
      );
    }

    return <pre className="raw-results">{JSON.stringify(results, null, 2)}</pre>;
  };

  return (
    <div className="sql-query-page">
      <div className="sql-header">
        <h1>🔍 SQL Query Runner</h1>
        <p>Execute SQL queries directly against the Railway database</p>
      </div>

      <div className="sql-container">
        <div className="sample-queries">
          <h3>📋 Sample Queries</h3>
          <div className="sample-buttons">
            {sampleQueries.map((sample, idx) => (
              <button
                key={idx}
                className="sample-button"
                onClick={() => loadSampleQuery(sample.query)}
              >
                {sample.name}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleExecuteQuery} className="query-form">
          <div className="query-input-container">
            <label htmlFor="query">SQL Query:</label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your SQL query here...&#10;&#10;Example:&#10;SELECT * FROM customer WHERE account_type = 'prime'"
              rows={10}
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="execute-button" disabled={loading || !query.trim()}>
              {loading ? '⏳ Executing...' : '▶️ Execute Query'}
            </button>
            <button type="button" className="clear-button" onClick={clearQuery}>
              🗑️ Clear
            </button>
          </div>
        </form>

        {error && (
          <div className="error-container">
            <h3>❌ Error</h3>
            <pre>{error}</pre>
          </div>
        )}

        {results && renderResults()}
      </div>

      <div className="sql-footer">
        <p>⚠️ Warning: Be careful with UPDATE, DELETE, and DROP statements!</p>
        <p>💡 Tip: Use LIMIT to restrict result size for large tables</p>
      </div>
    </div>
  );
};

export default SQLQueryPage;
