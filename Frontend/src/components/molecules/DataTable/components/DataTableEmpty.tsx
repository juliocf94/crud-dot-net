import { useDataTableContext } from '../provider';

interface Props {
    children?: React.ReactNode;
}

export default function DataTableEmpty({ children, }: Props) {
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
                {children}
            </td>
        </tr>
    );
}