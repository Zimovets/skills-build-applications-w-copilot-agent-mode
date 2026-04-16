import { useEffect, useMemo, useState } from 'react';

function DataView({
  title,
  subtitle,
  apiPath,
  emptyMessage,
  columns,
  rowLabel,
}) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiUrl = useMemo(() => {
    const codespaceName = process.env.REACT_APP_CODESPACE_NAME;
    const baseUrl = codespaceName
      ? `https://${codespaceName}-8000.app.github.dev`
      : 'http://localhost:8000';

    return `${baseUrl}${apiPath}`;
  }, [apiPath]);

  useEffect(() => {
    async function loadItems() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const normalizedItems = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
            ? data.results
            : [];

        setItems(normalizedItems);
      } catch (err) {
        setError(err.message || `Failed to load ${title.toLowerCase()}`);
      } finally {
        setIsLoading(false);
      }
    }

    loadItems();
  }, [apiUrl, title]);

  const filteredItems = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) {
      return items;
    }

    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(normalizedSearch)
    );
  }, [items, search]);

  return (
    <section className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
      <div className="card-body p-4 p-lg-5">
        <div className="d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 mb-4">
          <div>
            <h2 className="h3 fw-semibold mb-1 text-primary-emphasis">{title}</h2>
            <p className="text-body-secondary mb-0">{subtitle}</p>
          </div>
          <a
            href={apiUrl}
            target="_blank"
            rel="noreferrer"
            className="link-primary fw-semibold"
          >
            Open API endpoint
          </a>
        </div>

        <form
          className="row g-2 align-items-center mb-4"
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className="col-12 col-md">
            <label htmlFor={`${title}-search`} className="form-label mb-1">
              Search records
            </label>
            <input
              id={`${title}-search`}
              type="search"
              className="form-control"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
            />
          </div>
          <div className="col-12 col-md-auto d-flex gap-2 align-self-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setSearch('')}
            >
              Reset
            </button>
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setSelectedItem(null)}
            >
              Clear selection
            </button>
          </div>
        </form>

        {error && <div className="alert alert-danger mb-4">{error}</div>}

        {!error && isLoading && (
          <div className="d-flex align-items-center gap-2 text-body-secondary mb-4">
            <div className="spinner-border spinner-border-sm text-primary" role="status" />
            <span>Loading {title.toLowerCase()}...</span>
          </div>
        )}

        {!error && !isLoading && filteredItems.length === 0 && (
          <div className="alert alert-light border mb-4">{emptyMessage}</div>
        )}

        <div className="table-responsive">
          <table className="table table-striped table-hover align-middle mb-0 octo-table">
            <thead className="table-light">
              <tr>
                <th scope="col" style={{ width: '4rem' }}>
                  #
                </th>
                {columns.map((column) => (
                  <th key={column.header} scope="col">
                    {column.header}
                  </th>
                ))}
                <th scope="col" className="text-end" style={{ width: '10rem' }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item, index) => (
                <tr key={item?.id || item?._id || `${title}-${index}`}>
                  <th scope="row">{index + 1}</th>
                  {columns.map((column) => (
                    <td key={`${column.header}-${index}`}>{column.render(item)}</td>
                  ))}
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-primary"
                      onClick={() => setSelectedItem(item)}
                    >
                      View details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <>
          <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header">
                  <h3 className="modal-title h5 mb-0">
                    {rowLabel(selectedItem)} details
                  </h3>
                  <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={() => setSelectedItem(null)}
                  />
                </div>
                <div className="modal-body">
                  <pre className="bg-light border rounded-3 p-3 mb-0 overflow-auto modal-json">
                    {JSON.stringify(selectedItem, null, 2)}
                  </pre>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show" />
        </>
      )}
    </section>
  );
}

export default DataView;