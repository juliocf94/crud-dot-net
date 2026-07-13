import { useDataTableContext } from '../provider';

export default function Loading() {
    const { table } = useDataTableContext();
    const columnCount = table.getVisibleFlatColumns().length;

    return (
        <tr>
            <td
                colSpan={columnCount}
                style={{
                    textAlign: 'center',
                    padding: '2rem',
                }}
            >
                Cargando...
            </td>
        </tr>
    );
}