import { useDataTableContext } from '../provider';

export default function ResetStateButton() {
    const { hasPersistedState, resetPersistedState } = useDataTableContext();

    if (!hasPersistedState) return null;

    return (
        <button
            type="button"
            onClick={resetPersistedState}
        >
            Restablecer tabla
        </button>
    );
}
