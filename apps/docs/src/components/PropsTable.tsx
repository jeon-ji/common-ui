export interface DocgenProp {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
}

export interface DocgenEntry {
  displayName: string;
  description: string;
  props: DocgenProp[];
}

/** react-docgen-typescript 결과(`?docgen` import)를 렌더하는 자동 API 표 */
export function PropsTable({ docs }: { docs: DocgenEntry[] }) {
  return (
    <>
      {docs.map((entry) => (
        <section key={entry.displayName}>
          {docs.length > 1 && <h3 id={`api-${entry.displayName}`}>{entry.displayName}</h3>}
          {entry.description && <p>{entry.description}</p>}
          <table className="docs-props-table">
            <thead>
              <tr>
                <th scope="col">Prop</th>
                <th scope="col">Type</th>
                <th scope="col">Default</th>
                <th scope="col">설명</th>
              </tr>
            </thead>
            <tbody>
              {entry.props.map((prop) => (
                <tr key={prop.name}>
                  <td>
                    <code>{prop.name}</code>
                    {prop.required && (
                      <em className="docs-required" title="필수">
                        *
                      </em>
                    )}
                  </td>
                  <td>
                    <code>{prop.type}</code>
                  </td>
                  <td>{prop.defaultValue ? <code>{prop.defaultValue}</code> : "—"}</td>
                  <td>{prop.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </>
  );
}
